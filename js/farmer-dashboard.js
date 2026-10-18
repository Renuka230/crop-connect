
/* =====================================================
   CROP CONNECT - DYNAMIC FARMER DASHBOARD
   ===================================================== */

import { auth, db } from "./firebase.js";

import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

/* ---------------- PAGE NAVIGATION ---------------- */

function showPage(pageId, element) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (element) {
    element.classList.add("active");
  }

  document.getElementById("sidebar")?.classList.remove("mobile-open");

  if (pageId === "crops") {
    renderCrops();
  }
}

function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("mobile-open");
}

/* ---------------- CURRENT FARMER ---------------- */

let currentFarmer = null;
let crops = [];
let stopCropsListener = null;

function showToast(message) {
  document.querySelector(".toast")?.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function formatHarvestDate(dateString) {
  if (!dateString) return "Not set";

  const date = new Date(dateString + "T00:00:00");

  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

/* ---------------- AUTHENTICATION ---------------- */

onAuthStateChanged(auth, async user => {
  if (!user) {
    if (stopCropsListener) stopCropsListener();

    window.location.replace("../login.html");
    return;
  }

  currentFarmer = user;

  await loadProfile(user);
  loadFarmerCrops(user);
});

/* ---------------- LOAD CROPS ---------------- */

function loadFarmerCrops(user) {
  if (stopCropsListener) {
    stopCropsListener();
  }

  crops = [];

  renderCrops();
  renderDashboardPreview();
  updateCropCount();

  const cropsCollection = collection(db, "farmerCrops");

  const farmerQuery = query(
    cropsCollection,
    where("farmerId", "==", user.uid)
  );

  stopCropsListener = onSnapshot(
    farmerQuery,
    snapshot => {
      crops = snapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
      }));

      renderCrops();
      renderDashboardPreview();
      updateCropCount();
    },
    error => {
      console.error("Could not load crops:", error);
      showToast("Could not load crops. Check Firebase permissions.");
    }
  );
}

/* ---------------- ADD-CROP FORM ---------------- */

function openAddCropForm() {
  const formContainer = document.getElementById("addCropForm");

  if (!formContainer) {
    showToast("Add-crop form not found.");
    return;
  }

  formContainer.classList.add("show");

  formContainer.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function closeAddCropForm() {
  document.getElementById("addCropForm")?.classList.remove("show");
}

/* ---------------- ADD CROP ---------------- */

async function addCrop() {
  if (!currentFarmer) {
    showToast("Please log in first.");
    return;
  }

  const nameInput = document.getElementById("cropName");
  const categoryInput = document.getElementById("cropCategory");
  const quantityInput = document.getElementById("cropQuantity");
  const priceInput = document.getElementById("cropPrice");
  const dateInput = document.getElementById("harvestDate");
  const progressInput = document.getElementById("cropProgress");
  const statusInput = document.getElementById("cropStatus");

  if (
    !nameInput ||
    !categoryInput ||
    !quantityInput ||
    !priceInput ||
    !dateInput ||
    !progressInput ||
    !statusInput
  ) {
    showToast("Crop form fields are missing in the HTML.");
    console.error("One or more crop input IDs were not found.");
    return;
  }

  const name = nameInput.value.trim();
  const category = categoryInput.value;
  const quantity = Number(quantityInput.value);
  const price = Number(priceInput.value);
  const harvestDate = dateInput.value;
  const progress = Number(progressInput.value);
  const status = statusInput.value;

  if (
    !name ||
    !category ||
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !harvestDate ||
    !Number.isFinite(progress) ||
    progress < 0 ||
    progress > 100 ||
    !status
  ) {
    showToast("Please enter valid crop details.");
    return;
  }

  try {
    await addDoc(collection(db, "farmerCrops"), {
      farmerId: currentFarmer.uid,
      name,
      category,
      quantity,
      price,
      harvestDate,
      progress,
      status,
      createdAt: serverTimestamp()
    });

    // Reset the actual HTML form, not its container.
    const actualForm = document.querySelector("#addCropForm form");

    if (actualForm) {
      actualForm.reset();
    } else {
      // If #addCropForm itself is the form, reset it.
      const formContainer = document.getElementById("addCropForm");

      if (formContainer instanceof HTMLFormElement) {
        formContainer.reset();
      }
    }

    closeAddCropForm();
    showToast("Crop saved successfully!");

    // Firestore's onSnapshot listener refreshes the crop list.
  } catch (error) {
    console.error("Crop save failed:", error);
    showToast("Crop could not be saved. Check Firebase rules.");
  }
}

/* ---------------- DISPLAY ALL CROPS ---------------- */

function renderCrops() {
  const cropList = document.getElementById("fullCropList");

  if (!cropList) return;

  cropList.replaceChildren();

  if (crops.length === 0) {
    cropList.innerHTML = `
      <div class="empty-state">
        <h3>No crops added yet 🌱</h3>
        <p>Click "+ Add Crop" to add your first crop.</p>
      </div>
    `;

    updateCropCount();
    return;
  }

  crops.forEach(crop => {
    const item = document.createElement("div");
    item.className = "crop-list-item";

    item.innerHTML = `
      <div class="crop-image">🌱</div>

      <div class="crop-details">
        <h4>${escapeHtml(crop.name)}</h4>
        <p>Quantity: ${escapeHtml(crop.quantity)} kg</p>
        <p>
          Expected harvest:
          ${escapeHtml(formatHarvestDate(crop.harvestDate))}
        </p>
      </div>

      <div class="crop-progress">
        <div class="crop-progress-number">
          ${escapeHtml(crop.status)} - ${Number(crop.progress) || 0}%
        </div>

        <div class="progress">
          <div
            class="progress-bar"
            style="width:${Math.max(0, Math.min(100, Number(crop.progress) || 0))}%">
          </div>
        </div>
      </div>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-crop";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => deleteCrop(crop.id));

    item.appendChild(deleteButton);
    cropList.appendChild(item);
  });

  updateCropCount();
}

/* ---------------- DELETE CROP ---------------- */

async function deleteCrop(id) {
  if (!currentFarmer || !id) return;

  const crop = crops.find(item => item.id === id);

  if (!crop || crop.farmerId !== currentFarmer.uid) {
    showToast("Crop not found in your account.");
    return;
  }

  try {
    await deleteDoc(doc(db, "farmerCrops", id));

    showToast("Crop deleted successfully!");
    // The listener updates the displayed list.
  } catch (error) {
    console.error("Crop deletion failed:", error);
    showToast("Could not delete crop. Check Firebase rules.");
  }
}

/* ---------------- CROP COUNTS ---------------- */

function updateCropCount() {
  const count = crops.length;

  const activeCount = document.getElementById("activeCropCount");
  const totalCount = document.getElementById("cropTotal");

  if (activeCount) {
    activeCount.textContent = count;
  }

  if (totalCount) {
    totalCount.textContent = `${count} ${count === 1 ? "Crop" : "Crops"}`;
  }
}

/* ---------------- DASHBOARD PREVIEW ---------------- */

function renderDashboardPreview() {
  const container = document.getElementById("dashboardCropList");

  if (!container) return;

  container.replaceChildren();

  if (crops.length === 0) {
    container.innerHTML = "<p>No crops added yet.</p>";
    return;
  }

  crops.slice(0, 4).forEach(crop => {
    const item = document.createElement("div");
    item.className = "crop";

    item.innerHTML = `
      <div class="crop-image">🌱</div>

      <div class="crop-info">
        <strong>${escapeHtml(crop.name)}</strong>
        <p>Quantity: ${escapeHtml(crop.quantity)} kg</p>
        <p>Harvest: ${escapeHtml(formatHarvestDate(crop.harvestDate))}</p>
        <p>${escapeHtml(crop.status)}</p>

        <div class="progress-box">
          <div style="width:${Math.max(0, Math.min(100, Number(crop.progress) || 0))}%"></div>
        </div>

        <small>${Number(crop.progress) || 0}% complete</small>
      </div>
    `;

    container.appendChild(item);
  });
}

/* ---------------- PROFILE ---------------- */

async function loadProfile(user) {
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");

  let profile = {};

  try {
    const profileRef = doc(db, "users", user.uid);
    const profileSnapshot = await getDoc(profileRef);

    if (profileSnapshot.exists()) {
      profile = profileSnapshot.data();
    }
  } catch (error) {
    console.error("Could not load profile:", error);
  }

  const authName = user.displayName || "";
  const savedName = profile.name || authName;
  const nameParts = savedName.trim().split(/\s+/).filter(Boolean);

  const firstName = profile.firstName || nameParts[0] || "";
  const lastName =
    profile.lastName ||
    nameParts.slice(1).join(" ") ||
    "";

  if (firstNameInput) firstNameInput.value = firstName;
  if (lastNameInput) lastNameInput.value = lastName;

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const displayedName = fullName || user.email || "Farmer";

  document.querySelectorAll(".user-mini strong").forEach(element => {
    element.textContent = displayedName;
  });

  const heading = document.querySelector("#dashboard h1");

  if (heading) {
    heading.textContent = `Welcome back, ${firstName || "Farmer"}! 🌱`;
  }

  const profileHeading = document.querySelector(".profile-card h2");

  if (profileHeading) {
    profileHeading.textContent = displayedName;
  }

  document.querySelectorAll(
    "#email, #profileEmail, [name='email']"
  ).forEach(element => {
    if ("value" in element) {
      element.value = user.email || "";
    }
  });
}

async function saveProfile(event) {
  event?.preventDefault();

  if (!currentFarmer) {
    showToast("Please log in first.");
    return;
  }

  const firstName =
    document.getElementById("firstName")?.value.trim() || "";

  const lastName =
    document.getElementById("lastName")?.value.trim() || "";

  if (!firstName || !lastName) {
    showToast("Please enter your first and last name.");
    return;
  }

  const fullName = `${firstName} ${lastName}`;

  try {
    await setDoc(
      doc(db, "users", currentFarmer.uid),
      {
        firstName,
        lastName,
        name: fullName,
        email: currentFarmer.email || "",
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    await loadProfile(currentFarmer);

    showToast("Profile saved successfully!");
  } catch (error) {
    console.error("Profile save failed:", error);
    showToast("Could not save profile. Check Firebase rules.");
  }
}

/* ---------------- PROFILE PHOTO ---------------- */

function changePhoto() {
  const photoInput = document.getElementById("photoInput");

  if (photoInput) {
    photoInput.click();
  }
}

function previewProfilePhoto(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast("Please select an image smaller than 5 MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result;

    const avatarElements = [
      document.getElementById("profileAvatar"),
      document.querySelector(".user-mini .avatar")
    ];

    avatarElements.forEach(avatar => {
      if (!avatar) return;

      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = "Farmer profile photo";
      image.style.width = "100%";
      image.style.height = "100%";
      image.style.objectFit = "cover";
      image.style.borderRadius = "50%";

      avatar.replaceChildren(image);
    });

    showToast("Profile photo selected successfully!");
  };

  reader.onerror = () => {
    showToast("Could not open this image. Please try another.");
  };

  reader.readAsDataURL(file);
}

/* ---------------- SEARCH ---------------- */

function searchContent() {
  const input = document.getElementById("searchInput");

  if (!input) return;

  const searchText = input.value.toLowerCase().trim();

  document.querySelectorAll(".page").forEach(page => {
    if (!searchText) {
      page.style.outline = "none";
      return;
    }

    page.style.outline =
      page.innerText.toLowerCase().includes(searchText)
        ? "2px solid #2f7d45"
        : "none";
  });
}

/* ---------------- LOGOUT ---------------- */

async function logout() {
  if (!confirm("Are you sure you want to logout?")) return;

  try {
    if (stopCropsListener) stopCropsListener();

    await signOut(auth);

    window.location.replace("../login.html");
  } catch (error) {
    console.error("Logout failed:", error);
    showToast("Unable to log out. Please try again.");
  }
}

/* ---------------- HTML FUNCTION CONNECTIONS ---------------- */

Object.assign(window, {
  showPage,
  toggleSidebar,
  openAddCropForm,
  closeAddCropForm,
  addCrop,
  deleteCrop,
  saveProfile,
  changePhoto,
  searchContent,
  showToast,
  logout
});

/* ---------------- INITIAL COUNTS ---------------- */

renderCrops();
renderDashboardPreview();
updateCropCount();
