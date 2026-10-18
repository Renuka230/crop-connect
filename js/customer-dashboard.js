"use strict";

// ========================================
// FIREBASE + CATEGORY DATA
// ========================================

// This file assumes js/firebase.js exports your initialized Firestore database:
// export const db = getFirestore(app);

import { db } from "./firebase.js";
import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const categories = ["Vegetables", "Fruits", "Flowers", "Grains"];

const categoryIcons = {
    Vegetables: "🥕",
    Fruits: "🍎",
    Flowers: "🌷",
    Grains: "🌾"
};

// Products will be loaded from Firestore, not hardcoded here.
let farmerProducts = [];

const CART_KEY = "cropconnect_customer_cart";
const ORDERS_KEY = "cropconnect_customer_orders";
const PROFILE_KEY = "cropconnect_customer_profile";
const DELIVERY_FEE = 50;

let selectedCategory = null;
let cart = readStorage(CART_KEY, []);
let orders = readStorage(ORDERS_KEY, []);

let profile = readStorage(PROFILE_KEY, {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    address: "Pune, Maharashtra",
    photo: ""
});

let toastTimer;

// ========================================
// LOCAL STORAGE
// ========================================

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        console.error("Unable to read browser storage:", error);
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Unable to save browser storage:", error);
        showToast("Could not save data. Browser storage may be full.");
        return false;
    }
}

// ========================================
// LOAD FARMER CROPS FROM FIRESTORE
// ========================================

function listenForFarmerProducts() {
    const cropsCollection = collection(db, "farmerCrops");

    onSnapshot(
        cropsCollection,
        (snapshot) => {
            farmerProducts = snapshot.docs
                .map((documentSnapshot) => {
                    const crop = documentSnapshot.data();

                    return {
                        id: documentSnapshot.id,
                        name: crop.name || "Unnamed crop",
                        category: crop.category || "",
                        price: Number(crop.price),
                        farmer: crop.farmerName || "Crop Connect Farmer",
                        location: crop.location || "Location not provided",
                        icon: categoryIcons[crop.category] || "🌱",
                        status: crop.status || "Available"
                    };
                })
                .filter((product) => {
                    return (
                        categories.includes(product.category) &&
                        Number.isFinite(product.price) &&
                        product.price > 0 &&
                        product.status.toLowerCase() !== "unavailable"
                    );
                });

            console.log("Farmer products loaded:", farmerProducts);

            // Refresh the selected category when Firestore changes.
            if (selectedCategory) {
                renderCategoryProducts();
            }
        },
        (error) => {
            console.error("Could not load farmer crops:", error);

            const grid = document.getElementById("productsGrid");
            if (grid && selectedCategory) {
                grid.innerHTML = `
                    <p class="empty-message">
                        Products could not be loaded. Check your Firestore
                        security rules and Firebase connection.
                    </p>
                `;
            }
        }
    );
}

// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;

    document.querySelectorAll(".page").forEach((item) => {
        item.classList.remove("active");
    });

    page.classList.add("active");

    document.querySelectorAll(".nav-item").forEach((link) => {
        link.classList.toggle("active", link.dataset.page === pageId);
    });

    document.getElementById("sidebar").classList.remove("open");

    if (pageId === "cart") renderCart();
    if (pageId === "orders") renderOrders();
    if (pageId === "profile") loadProfile();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

// ========================================
// CATEGORY SELECTION
// ========================================

function showCategory(category, button) {
    if (!categories.includes(category)) {
        console.error("Unknown category:", category);
        return;
    }

    selectedCategory = category;

    document.querySelectorAll(".category-card").forEach((card) => {
        card.classList.remove("active");
    });

    if (button) button.classList.add("active");

    const section = document.getElementById("categoryProductsSection");
    const title = document.getElementById("categoryTitle");
    const description = document.getElementById("categoryDescription");
    const grid = document.getElementById("productsGrid");

    if (!section || !title || !description || !grid) {
        console.error("Products section elements are missing from the HTML.");
        return;
    }

    section.classList.add("category-visible");

    title.textContent = category;
    description.textContent =
        `Crops listed by farmers in the ${category.toLowerCase()} category`;

    document.getElementById("searchInput").value = "";

    renderCategoryProducts();

    section.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ========================================
// RENDER FIRESTORE PRODUCTS
// ========================================

function renderCategoryProducts() {
    const grid = document.getElementById("productsGrid");

    if (!grid || !selectedCategory) return;

    const searchText = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const filteredProducts = farmerProducts.filter((product) => {
        const matchesCategory = product.category === selectedCategory;

        const searchableText = [
            product.name,
            product.farmer,
            product.location
        ].join(" ").toLowerCase();

        return matchesCategory && searchableText.includes(searchText);
    });

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <p class="empty-message">
                No farmer-listed crops found in this category yet.
            </p>
        `;
        return;
    }

    grid.innerHTML = "";

    filteredProducts.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-image";

        const emoji = document.createElement("span");
        emoji.className = "product-emoji";
        emoji.textContent = product.icon;
        image.appendChild(emoji);

        const details = document.createElement("div");
        details.className = "product-details";

        const name = document.createElement("div");
        name.className = "product-title";
        name.textContent = product.name;

        const farmer = document.createElement("div");
        farmer.className = "farmer-name";
        farmer.innerHTML = '<i class="fa-solid fa-user"></i> ';
        farmer.appendChild(document.createTextNode(product.farmer));

        const location = document.createElement("div");
        location.className = "location";
        location.innerHTML = '<i class="fa-solid fa-location-dot"></i> ';
        location.appendChild(document.createTextNode(product.location));

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "price";
        price.textContent = `₹${product.price} / kg`;

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "add-cart-btn";
        addButton.setAttribute(
            "aria-label",
            `Add ${product.name} to cart`
        );
        addButton.innerHTML = '<i class="fa-solid fa-plus"></i>';

        addButton.addEventListener("click", () => {
            addToCart(product.name, product.price);
        });

        bottom.append(price, addButton);
        details.append(name, farmer, location, bottom);
        card.append(image, details);
        grid.appendChild(card);
    });
}

function searchProducts() {
    if (selectedCategory !== null) {
        renderCategoryProducts();
    }
}

// ========================================
// CART
// ========================================

function addToCart(name, price) {
    const updatedCart = cart.map((item) => ({ ...item }));
    const existingItem = updatedCart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        updatedCart.push({
            name,
            price: Number(price),
            quantity: 1
        });
    }

    if (!writeStorage(CART_KEY, updatedCart)) return;

    cart = updatedCart;
    updateCartBadge();
    showToast(`${name} added to cart!`);
}

function changeQuantity(name, amount) {
    const updatedCart = cart.map((item) => ({ ...item }));
    const item = updatedCart.find((product) => product.name === name);

    if (!item) return;

    item.quantity += amount;

    const finalCart = updatedCart.filter(
        (product) => product.quantity > 0
    );

    if (!writeStorage(CART_KEY, finalCart)) return;

    cart = finalCart;
    updateCartBadge();
    renderCart();
}

function removeFromCart(name) {
    const updatedCart = cart.filter((item) => item.name !== name);

    if (!writeStorage(CART_KEY, updatedCart)) return;

    cart = updatedCart;
    updateCartBadge();
    renderCart();
    showToast("Product removed from cart.");
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");

    if (badge) {
        badge.textContent = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );
    }
}

function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <h3>Your cart is empty</h3>
                <p>Choose a category and add some products.</p>
                <button class="primary-btn" onclick="showPage('dashboard')">
                    Browse Products
                </button>
            </div>
        `;
    } else {
        container.innerHTML = "";

        cart.forEach((item) => {
            const row = document.createElement("div");
            row.className = "cart-item";

            const info = document.createElement("div");
            info.innerHTML = `
                <strong></strong>
                <p>₹${item.price} per kg</p>
                <strong>₹${item.price * item.quantity}</strong>
            `;
            info.querySelector("strong").textContent = item.name;

            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const minus = document.createElement("button");
            minus.textContent = "−";
            minus.onclick = () => changeQuantity(item.name, -1);

            const quantity = document.createElement("span");
            quantity.textContent = item.quantity;

            const plus = document.createElement("button");
            plus.textContent = "+";
            plus.onclick = () => changeQuantity(item.name, 1);

            const remove = document.createElement("button");
            remove.className = "remove-btn";
            remove.innerHTML = '<i class="fa-solid fa-trash"></i>';
            remove.setAttribute("aria-label", `Remove ${item.name}`);
            remove.onclick = () => removeFromCart(item.name);

            controls.append(minus, quantity, plus, remove);
            row.append(info, controls);
            container.appendChild(row);
        });
    }

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const delivery = cart.length > 0 ? DELIVERY_FEE : 0;

    document.getElementById("summaryItems").textContent = count;
    document.getElementById("cartSubtotal").textContent = "₹" + subtotal;
    document.getElementById("deliveryFee").textContent = "₹" + delivery;
    document.getElementById("cartTotal").textContent =
        "₹" + (subtotal + delivery);
}

// ========================================
// PLACE ORDER (currently browser-local)
// ========================================

function placeOrder() {
    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const newOrder = {
        id: "CC" + Date.now().toString().slice(-8),
        products: cart.map((item) => ({ ...item })),
        amount: subtotal + DELIVERY_FEE,
        date: new Date().toLocaleDateString("en-IN"),
        status: "Processing"
    };

    const updatedOrders = [newOrder, ...orders];

    if (!writeStorage(ORDERS_KEY, updatedOrders)) return;
    if (!writeStorage(CART_KEY, [])) return;

    orders = updatedOrders;
    cart = [];

    updateCartBadge();
    renderCart();
    renderOrders();
    showToast("Order placed successfully!");
    showPage("orders");
}

function renderOrders() {
    const table = document.getElementById("ordersTable");
    if (!table) return;

    table.innerHTML = "";

    if (orders.length === 0) {
        table.innerHTML =
            '<tr><td colspan="5">You have not placed any orders yet.</td></tr>';
        return;
    }

    orders.forEach((order) => {
        const row = document.createElement("tr");

        const productNames = order.products
            .map((item) => `${item.name} × ${item.quantity}`)
            .join(", ");

        [
            "#" + order.id,
            productNames,
            "₹" + order.amount,
            order.date,
            order.status
        ].forEach((value, index) => {
            const cell = document.createElement("td");

            if (index === 4) {
                const status = document.createElement("span");
                status.className = "status";
                status.textContent = value;
                cell.appendChild(status);
            } else {
                cell.textContent = value;
            }

            row.appendChild(cell);
        });

        table.appendChild(row);
    });
}

// ========================================
// CUSTOMER PROFILE
// ========================================

function loadProfile() {
    document.getElementById("firstName").value = profile.firstName || "";
    document.getElementById("lastName").value = profile.lastName || "";
    document.getElementById("email").value = profile.email || "";
    document.getElementById("phone").value = profile.phone || "";
    document.getElementById("address").value = profile.address || "";

    updateProfileDisplay();
}

function saveProfile(event) {
    event.preventDefault();

    const updatedProfile = {
        ...profile,
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim()
    };

    if (!writeStorage(PROFILE_KEY, updatedProfile)) return;

    profile = updatedProfile;
    updateProfileDisplay();
    showToast("Profile updated successfully!");
}

function updateProfileDisplay() {
    const fullName =
        `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
        "Customer";

    document.getElementById("headerName").textContent = fullName;
    document.getElementById("profileDisplayName").textContent = fullName;

    const initials = fullName
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const headerAvatar = document.getElementById("headerAvatar");
    const profileAvatar = document.getElementById("profileAvatar");

    [headerAvatar, profileAvatar].forEach((avatar) => {
        avatar.replaceChildren();

        if (profile.photo) {
            const image = document.createElement("img");
            image.src = profile.photo;
            image.alt = "Customer profile photo";
            avatar.appendChild(image);
        } else {
            avatar.textContent = initials;
        }
    });
}

function changePhoto(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image.");
        event.target.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showToast("Please choose an image smaller than 2 MB.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        const updatedProfile = { ...profile, photo: reader.result };

        if (!writeStorage(PROFILE_KEY, updatedProfile)) return;

        profile = updatedProfile;
        updateProfileDisplay();
        showToast("Profile photo updated!");
    };

    reader.onerror = () => showToast("Unable to read the selected image.");
    reader.readAsDataURL(file);
}

function removePhoto() {
    const updatedProfile = { ...profile, photo: "" };

    if (!writeStorage(PROFILE_KEY, updatedProfile)) return;

    profile = updatedProfile;
    updateProfileDisplay();
    document.getElementById("photoInput").value = "";
    showToast("Profile photo removed.");
}

// ========================================
// LOGOUT + TOAST
// ========================================

function logout() {
    if (!confirm("Are you sure you want to log out?")) return;

    // Update this path if your login page is located elsewhere.
    window.location.href = "../index.html";
}

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// ========================================
// EXPOSE FUNCTIONS USED BY HTML ONCLICK
// (Because this file is loaded as a JavaScript module)
// ========================================

Object.assign(window, {
    showPage,
    toggleSidebar,
    showCategory,
    searchProducts,
    addToCart,
    changeQuantity,
    removeFromCart,
    placeOrder,
    saveProfile,
    changePhoto,
    removePhoto,
    logout
});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    selectedCategory = null;

    const section = document.getElementById("categoryProductsSection");
    if (section) section.classList.remove("category-visible");

    updateCartBadge();
    renderCart();
    renderOrders();
    loadProfile();

    // Start listening for crops farmers add or edit in Firestore.
    listenForFarmerProducts();

    console.log("CropConnect customer dashboard initialized.");
});