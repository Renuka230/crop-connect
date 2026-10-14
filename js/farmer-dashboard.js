
/* =========================================================
   FARMER DASHBOARD JAVASCRIPT
   ========================================================= */

import { auth } from "./firebase.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageId, element) {
  if (window.event) {
    window.event.preventDefault();
  }

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

  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.remove("mobile-open");
  }

  if (pageId === "crops") {
    renderCrops();
  }
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.toggle("mobile-open");
  }
}


/* =========================================================
   CROP DATA
   ========================================================= */

let crops = [
  {
    id: 1,
    name: "🌾 Wheat",
    quantity: 3000,
    harvest: "20 Oct",
    progress: 65,
    status: "Growing"
  },
  {
    id: 2,
    name: "🌽 Maize",
    quantity: 2500,
    harvest: "5 Oct",
    progress: 90,
    status: "Almost Ready"
  },
  {
    id: 3,
    name: "🥔 Potato",
    quantity: 2200,
    harvest: "15 Nov",
    progress: 40,
    status: "Growing"
  },
  {
    id: 4,
    name: "🧅 Onion",
    quantity: 1800,
    harvest: "30 Nov",
    progress: 25,
    status: "Early Stage"
  }
];


/* =========================================================
   ADD CROP FORM
   ========================================================= */

function openAddCropForm() {
  const form = document.getElementById("addCropForm");

  if (form) {
    form.classList.add("show");

    form.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function closeAddCropForm() {
  const form = document.getElementById("addCropForm");

  if (form) {
    form.classList.remove("show");
  }
}


/* =========================================================
   ADD NEW CROP
   ========================================================= */

function addCrop(event) {
  event.preventDefault();

  const cropName = document.getElementById("cropName").value;
  const quantity = document.getElementById("cropQuantity").value;
  const harvestDate = document.getElementById("harvestDate").value;
  const progress = document.getElementById("cropProgress").value;
  const status = document.getElementById("cropStatus").value;

  if (!cropName || !quantity || !harvestDate || progress === "") {
    showToast("Please fill all crop details.");
    return;
  }

  const dateObject = new Date(harvestDate + "T12:00:00");

  const harvest = dateObject.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short"
  });

  const newCrop = {
    id: Date.now(),
    name: cropName,
    quantity: Number(quantity),
    harvest: harvest,
    progress: Number(progress),
    status: status
  };

  crops.push(newCrop);

  renderCrops();
  updateCropCount();

  const form = document.querySelector("#addCropForm form");

  if (form) {
    form.reset();
  }

  closeAddCropForm();
  showToast("Crop added successfully! 🌱");
}


/* =========================================================
   DISPLAY CROPS
   ========================================================= */

function renderCrops() {
  const cropList = document.getElementById("fullCropList");

  if (!cropList) {
    return;
  }

  cropList.innerHTML = "";

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
    const cropElement = document.createElement("div");

    cropElement.className = "crop-list-item";

    const spaceIndex = crop.name.indexOf(" ");

    const emoji = spaceIndex === -1
      ? ""
      : crop.name.substring(0, spaceIndex);

    const name = spaceIndex === -1
      ? crop.name
      : crop.name.substring(spaceIndex + 1);

    cropElement.innerHTML = `
      <div class="crop-image">${emoji}</div>

      <div class="crop-details">
        <h4>${name}</h4>
        <p>Quantity: ${crop.quantity.toLocaleString()} kg</p>
        <p>Expected harvest: ${crop.harvest}</p>
      </div>

      <div class="crop-progress">
        <div class="crop-progress-number">
          ${crop.status} - ${crop.progress}%
        </div>

        <div class="progress">
          <div
            class="progress-bar"
            style="width:${crop.progress}%"
          ></div>
        </div>
      </div>

      <button
        class="delete-crop"
        onclick="deleteCrop(${crop.id})"
      >
        Delete
      </button>
    `;

    cropList.appendChild(cropElement);
  });

  const total = document.getElementById("cropTotal");

  if (total) {
    total.textContent =
      `${crops.length} ${crops.length === 1 ? "Crop" : "Crops"}`;
  }

  updateCropCount();
}


/* =========================================================
   DELETE CROP
   ========================================================= */

function deleteCrop(id) {
  const crop = crops.find(item => item.id === id);

  if (!crop) {
    return;
  }

  const spaceIndex = crop.name.indexOf(" ");

  const cropName = spaceIndex === -1
    ? crop.name
    : crop.name.substring(spaceIndex + 1);

  const confirmation = confirm(
    `Are you sure you want to delete ${cropName}?`
  );

  if (!confirmation) {
    return;
  }

  crops = crops.filter(item => item.id !== id);

  renderCrops();
  showToast("Crop deleted successfully.");
}


/* =========================================================
   UPDATE ACTIVE CROP COUNT
   ========================================================= */

function updateCropCount() {
  const count = document.getElementById("activeCropCount");

  if (count) {
    count.textContent = crops.length;
  }
}


/* =========================================================
   TASK COMPLETION
   ========================================================= */

function completeTask(element) {
  element.classList.toggle("completed");

  const taskText = element.nextElementSibling;

  if (taskText) {
    taskText.classList.toggle("completed");
  }

  if (element.classList.contains("completed")) {
    showToast("Task completed! ✓");
  }
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotification() {
  const existing = document.querySelector(".notification-message");

  if (existing) {
    existing.remove();
  }

  const message = document.createElement("div");

  message.className = "notification-message";
  message.textContent = "🔔 You have 3 new notifications.";

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}


/* =========================================================
   PROFILE
   ========================================================= */

function saveProfile(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();

  if (!firstName || !lastName) {
    showToast("Please enter your name.");
    return;
  }

  const fullName = `${firstName} ${lastName}`;

  const userName = document.querySelector(".user-mini strong");

  if (userName) {
    userName.textContent = fullName;
  }

  const heading = document.querySelector("#dashboard h1");

  if (heading) {
    heading.textContent = `Welcome back, ${firstName}! 🌱`;
  }

  const profileName = document.querySelector(".profile-card h2");

  if (profileName) {
    profileName.textContent = fullName;
  }

  showToast("Profile updated successfully! ✓");
}


/* =========================================================
   CHANGE PROFILE PHOTO
   ========================================================= */

function changePhoto() {
  showToast(
    "Photo upload will be connected to your profile storage later."
  );
}


/* =========================================================
   SETTINGS
   ========================================================= */

function saveSettings() {
  showToast("Settings saved successfully! ✓");
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchContent() {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) {
    return;
  }

  const searchText = searchInput.value.toLowerCase().trim();

  document.querySelectorAll(".page").forEach(page => {
    if (!searchText) {
      page.style.outline = "none";
      return;
    }

    const text = page.innerText.toLowerCase();

    page.style.outline = text.includes(searchText)
      ? "2px solid #2f7d45"
      : "none";
  });
}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showToast(message) {
  const oldToast = document.querySelector(".toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}


/* =========================================================
   FIREBASE LOGOUT
   ========================================================= */

async function logout() {
  const confirmation = confirm("Are you sure you want to logout?");

  if (!confirmation) {
    return;
  }

  try {
    await signOut(auth);

    // Return to login page in the project root
    window.location.replace("../login.html");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Unable to log out. Please try again.");
  }
}


/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
   ========================================================= */

Object.assign(window, {
  showPage,
  toggleSidebar,
  openAddCropForm,
  closeAddCropForm,
  addCrop,
  deleteCrop,
  completeTask,
  showNotification,
  saveProfile,
  changePhoto,
  saveSettings,
  searchContent,
  showToast,
  logout
});


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  renderCrops();
  updateCropCount();
});
