/* =========================================================
   FARMER DASHBOARD JAVASCRIPT
   ========================================================= */


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageId, element) {

  // Prevent # from appearing in URL
  if (event) {
    event.preventDefault();
  }

  // Hide all pages
  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active");
  });


  // Show selected page
  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }


  // Remove active class from sidebar
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {
    item.classList.remove("active");
  });


  // Add active class
  if (element) {
    element.classList.add("active");
  }


  // Close mobile sidebar
  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.remove("mobile-open");
  }


  // If My Crops page is opened, refresh crop list
  if (pageId === "crops") {
    renderCrops();
  }

}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function toggleSidebar() {

  const sidebar = document.getElementById("sidebar");

  sidebar.classList.toggle("mobile-open");

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
   OPEN ADD CROP FORM
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


/* =========================================================
   CLOSE ADD CROP FORM
   ========================================================= */

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


  const cropName =
    document.getElementById("cropName").value;

  const quantity =
    document.getElementById("cropQuantity").value;

  const harvestDate =
    document.getElementById("harvestDate").value;

  const progress =
    document.getElementById("cropProgress").value;

  const status =
    document.getElementById("cropStatus").value;


  if (!cropName || !quantity || !harvestDate || !progress) {

    showToast("Please fill all crop details.");

    return;

  }


  // Convert date to readable format
  const dateObject = new Date(harvestDate);

  const harvest = dateObject.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short"
    }
  );


  // Create new crop
  const newCrop = {

    id: Date.now(),

    name: cropName,

    quantity: Number(quantity),

    harvest: harvest,

    progress: Number(progress),

    status: status

  };


  crops.push(newCrop);


  // Refresh list
  renderCrops();


  // Update dashboard count
  updateCropCount();


  // Clear form
  document.querySelector("#addCropForm form").reset();


  // Hide form
  closeAddCropForm();


  // Show message
  showToast("Crop added successfully! 🌱");

}


/* =========================================================
   DISPLAY CROPS
   ========================================================= */

function renderCrops() {

  const cropList =
    document.getElementById("fullCropList");


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

    return;

  }


  crops.forEach(crop => {

    const cropElement = document.createElement("div");

    cropElement.className = "crop-list-item";


    cropElement.innerHTML = `

      <div class="crop-image">
        ${crop.name.split(" ")[0]}
      </div>


      <div class="crop-details">

        <h4>
          ${crop.name.substring(crop.name.indexOf(" ") + 1)}
        </h4>

        <p>
          Quantity: ${crop.quantity.toLocaleString()} kg
        </p>

        <p>
          Expected harvest: ${crop.harvest}
        </p>

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


  const total =
    document.getElementById("cropTotal");

  if (total) {

    total.textContent =
      `${crops.length} ${crops.length === 1 ? "Crop" : "Crops"}`;

  }

}


/* =========================================================
   DELETE CROP
   ========================================================= */

function deleteCrop(id) {

  const crop = crops.find(c => c.id === id);

  if (!crop) {
    return;
  }


  const cropName =
    crop.name.substring(crop.name.indexOf(" ") + 1);


  const confirmation =
    confirm(`Are you sure you want to delete ${cropName}?`);


  if (!confirmation) {
    return;
  }


  crops =
    crops.filter(crop => crop.id !== id);


  renderCrops();

  updateCropCount();

  showToast("Crop deleted successfully.");

}


/* =========================================================
   UPDATE ACTIVE CROP COUNT
   ========================================================= */

function updateCropCount() {

  const count =
    document.getElementById("activeCropCount");

  if (count) {
    count.textContent = crops.length;
  }

}


/* =========================================================
   TASK COMPLETION
   ========================================================= */

function completeTask(element) {

  element.classList.toggle("completed");


  const taskText =
    element.nextElementSibling;


  if (taskText) {
    taskText.classList.toggle("completed");
  }


  if (element.classList.contains("completed")) {

    showToast("Task completed! ✓");

  }

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

function showNotification() {

  const existing =
    document.querySelector(".notification-message");


  if (existing) {
    existing.remove();
  }


  const message =
    document.createElement("div");


  message.className =
    "notification-message";


  message.innerHTML = `
    🔔 You have 3 new notifications.
  `;


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


  const firstName =
    document.getElementById("firstName").value;

  const lastName =
    document.getElementById("lastName").value;


  if (!firstName || !lastName) {

    showToast("Please enter your name.");

    return;

  }


  // Update name in top bar
  const userName =
    document.querySelector(".user-mini strong");


  if (userName) {

    userName.textContent =
      `${firstName} ${lastName}`;

  }


  // Update dashboard greeting
  const heading =
    document.querySelector("#dashboard h1");


  if (heading) {

    heading.textContent =
      `Welcome back, ${firstName}! 🌱`;

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

  const searchInput =
    document.getElementById("searchInput");


  if (!searchInput) {
    return;
  }


  const searchText =
    searchInput.value.toLowerCase().trim();


  if (searchText === "") {
    return;
  }


  const pages =
    document.querySelectorAll(".page");


  pages.forEach(page => {

    const text =
      page.innerText.toLowerCase();


    if (text.includes(searchText)) {

      page.style.outline =
        "2px solid #2f7d45";

    } else {

      page.style.outline =
        "none";

    }

  });

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

  const confirmation =
    confirm("Are you sure you want to logout?");


  if (!confirmation) {
    return;
  }


  showToast("Logging out...");


  setTimeout(() => {

    /*
       Later you can replace this with:

       window.location.href = "../login.html";

       when your login page is ready.
    */

    window.location.href = "../index.html";

  }, 1000);

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showToast(message) {

  const oldToast =
    document.querySelector(".toast");


  if (oldToast) {
    oldToast.remove();
  }


  const toast =
    document.createElement("div");


  toast.className = "toast";

  toast.textContent = message;


  document.body.appendChild(toast);


  setTimeout(() => {

    toast.remove();

  }, 2500);

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  // Display crops
  renderCrops();

  // Update crop count
  updateCropCount();

});