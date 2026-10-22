
"use strict";

// ========================================
// FIREBASE + CATEGORY DATA
// ========================================
import { auth, db } from "./firebase.js";

import {
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const categories = ["Vegetables", "Fruits", "Flowers", "Grains"];

const categoryIcons = {
    Vegetables: "🥕",
    Fruits: "🍎",
    Flowers: "🌷",
    Grains: "🌾"
};

// ========================================
// RECIPES AND FLOWER DECORATION IDEAS
// Ideas appear after clicking "View Recipes"
// on a product card.
// ========================================

const recipeData = {
    // ---------- VEGETABLES ----------

    tomato: [
        {
            name: "Fresh Tomato Soup",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkq47WDLvd2dwEWxHG_2zkLygxaJg9jFeZfTpS9VzYBw&s=10",
            time: "20 minutes",
            difficulty: "Easy",
            description: "A warm, simple soup made with ripe tomatoes.",
            ingredients: ["Tomatoes", "Onion", "Garlic", "Pepper", "Salt"],
            instructions: [
                "Wash and chop the tomatoes and onion.",
                "Cook the onion and garlic until softened.",
                "Add tomatoes and simmer until tender.",
                "Blend carefully, season, and serve warm."
            ],
            youtube: "https://www.youtube.com/results?search_query=easy+fresh+tomato+soup+recipe"
        },
        {
            name: "Tomato Chutney",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkq47WDLvd2dwEWxHG_2zkLygxaJg9jFeZfTpS9VzYBw&s=10",
            time: "15 minutes",
            difficulty: "Easy",
            description: "A tangy tomato chutney for meals and snacks.",
            ingredients: ["Tomatoes", "Garlic", "Chilli", "Oil", "Salt"],
            instructions: [
                "Wash and chop the tomatoes.",
                "Cook the tomatoes with garlic and chilli.",
                "Add salt and cook until soft.",
                "Mash or blend to make a chutney."
            ],
            youtube: "https://www.youtube.com/results?search_query=easy+tomato+chutney+recipe"
        },
        {
            name: "Tomato Rice",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkq47WDLvd2dwEWxHG_2zkLygxaJg9jFeZfTpS9VzYBw&s=10",
            time: "25 minutes",
            difficulty: "Easy",
            description: "A flavorful rice dish prepared with tomatoes and spices.",
            ingredients: ["Rice", "Tomatoes", "Onion", "Spices", "Oil"],
            instructions: [
                "Cook the rice and keep it aside.",
                "Cook chopped onion and tomatoes with spices.",
                "Add the cooked rice.",
                "Mix gently and cook for a few minutes."
            ],
            youtube: "https://www.youtube.com/results?search_query=easy+tomato+rice+recipe"
        }
    ],

    potato: [
        {
            name: "Aloo Palak",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNKsFxMICHT5OyVDHAIYLC7ymFmMOaJ88XupnHoasNAA&s=10",
            time: "25 minutes",
            difficulty: "Easy",
            description: "An Indian curry made with spinach and potatoes.",
            ingredients: ["Spinach", "Potatoes", "Onion", "Garlic", "Spices"],
            instructions: [
                "Wash and chop the spinach and potatoes.",
                "Cook onion and garlic with spices.",
                "Add potatoes and cook until nearly tender.",
                "Add spinach and simmer until cooked."
            ],
            youtube: "https://www.youtube.com/results?search_query=easy+aloo+palak+recipe"
        },
        {
            name: "Potato Curry",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNKsFxMICHT5OyVDHAIYLC7ymFmMOaJ88XupnHoasNAA&s=10",
            time: "30 minutes",
            difficulty: "Easy",
            description: "A simple Indian-style potato curry.",
            ingredients: ["Potatoes", "Onion", "Tomatoes", "Spices", "Oil"],
            instructions: [
                "Wash, peel, and chop the potatoes.",
                "Cook onion and tomatoes with spices.",
                "Add potatoes and water.",
                "Cover and cook until tender."
            ],
            youtube: "https://www.youtube.com/results?search_query=easy+Indian+potato+curry+recipe"
        },
        {
            name: "Crispy Potato Fry",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNKsFxMICHT5OyVDHAIYLC7ymFmMOaJ88XupnHoasNAA&s=10",
            time: "20 minutes",
            difficulty: "Easy",
            description: "Spiced potato pieces cooked until golden.",
            ingredients: ["Potatoes", "Oil", "Chilli powder", "Salt", "Spices"],
            instructions: [
                "Wash and cut the potatoes into small pieces.",
                "Heat a little oil in a pan.",
                "Add potatoes and season with spices.",
                "Cook until tender and golden."
            ],
            youtube: "https://www.youtube.com/results?search_query=crispy+Indian+potato+fry+recipe"
        }
    ],

    onion: [
        {
            name: "Onion Pakora",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-RDiRLgGAcOUeCtn07FlMMapJRxicFbL4LsTXJSwGmg&s=10",
            time: "20 minutes",
            difficulty: "Easy",
            description: "Crispy onion fritters for a tasty snack.",
            ingredients: ["Onions", "Gram flour", "Chilli", "Salt", "Oil"],
            instructions: [
                "Slice the onions thinly.",
                "Mix with gram flour, chilli, and salt.",
                "Add a little water to make the mixture hold together.",
                "Cook small portions in hot oil until golden."
            ],
            youtube: "https://www.youtube.com/results?search_query=easy+onion+pakora+recipe"
        },
        {
            name: "Onion Chutney",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-RDiRLgGAcOUeCtn07FlMMapJRxicFbL4LsTXJSwGmg&s=10",
            time: "15 minutes",
            difficulty: "Easy",
            description: "A savory chutney for dosa, idli, or other meals.",
            ingredients: ["Onions", "Chilli", "Garlic", "Oil", "Salt"],
            instructions: [
                "Chop the onions and garlic.",
                "Cook them with chilli until softened.",
                "Allow the mixture to cool.",
                "Blend with salt to make chutney."
            ],
            youtube: "https://www.youtube.com/results?search_query=easy+onion+chutney+recipe"
        },
        {
            name: "Onion Paratha",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-RDiRLgGAcOUeCtn07FlMMapJRxicFbL4LsTXJSwGmg&s=10",
            time: "25 minutes",
            difficulty: "Medium",
            description: "A flatbread filled with seasoned chopped onions.",
            ingredients: ["Wheat flour", "Onions", "Spices", "Water", "Oil"],
            instructions: [
                "Prepare a soft dough using wheat flour and water.",
                "Chop the onions and mix with spices.",
                "Fill and roll the dough into a flatbread.",
                "Cook on a hot pan until both sides are done."
            ],
            youtube: "https://www.youtube.com/results?search_query=easy+onion+paratha+recipe"
        }
    ],

    // ---------- FLOWERS: DECORATION IDEAS ----------

    rose: [
        {
            name: "Rose Bouquet",
            image: "",
            time: "15 minutes",
            difficulty: "Easy",
            description: "Make a beautiful bouquet using fresh roses.",
            ingredients: ["Fresh roses", "Wrapping paper", "Ribbon"],
            instructions: [
                "Arrange the roses into a bouquet.",
                "Wrap the stems with decorative paper.",
                "Tie the bouquet with a ribbon."
            ],
            youtube: "https://www.youtube.com/results?search_query=DIY+rose+flower+bouquet"
        },
        {
            name: "Rose Petal Decoration",
            image: "",
            time: "10 minutes",
            difficulty: "Easy",
            description: "Create a decorative pattern using rose petals.",
            ingredients: ["Rose petals", "A clean tray or plate"],
            instructions: [
                "Choose a simple pattern.",
                "Arrange the petals carefully into the pattern."
            ],
            youtube: "https://www.youtube.com/results?search_query=rose+petal+decoration+DIY"
        },
        {
            name: "Rose Vase Arrangement",
            image: "",
            time: "10 minutes",
            difficulty: "Easy",
            description: "Arrange roses in a vase for home decoration.",
            ingredients: ["Fresh roses", "Vase", "Water"],
            instructions: [
                "Fill the vase with clean water.",
                "Trim the flower stems if needed.",
                "Arrange the roses in the vase."
            ],
            youtube: "https://www.youtube.com/results?search_query=rose+flower+vase+arrangement"
        }
    ],

    marigold: [
        {
            name: "Marigold Flower Toran",
            image: "",
            time: "25 minutes",
            difficulty: "Easy",
            description: "Make a colourful flower toran for a doorway.",
            ingredients: ["Marigold flowers", "Thread", "Decorative string"],
            instructions: [
                "Arrange the flowers in a pattern.",
                "Carefully thread the flowers together.",
                "Hang the toran as a decoration."
            ],
            youtube: "https://www.youtube.com/results?search_query=marigold+flower+toran+making"
        },
        {
            name: "Marigold Garland",
            image: "",
            time: "20 minutes",
            difficulty: "Easy",
            description: "Make a flower garland for festive decoration.",
            ingredients: ["Marigold flowers", "Thread", "Needle"],
            instructions: [
                "Prepare the flowers.",
                "Thread the flowers together in a repeating pattern."
            ],
            youtube: "https://www.youtube.com/results?search_query=marigold+flower+garland+making"
        },
        {
            name: "Marigold Rangoli",
            image: "",
            time: "15 minutes",
            difficulty: "Easy",
            description: "Create a festive design using marigold petals.",
            ingredients: ["Marigold petals", "A clean floor or plate"],
            instructions: [
                "Choose a simple rangoli design.",
                "Arrange the petals to create the design."
            ],
            youtube: "https://www.youtube.com/results?search_query=marigold+petal+rangoli+design"
        }
    ],

    jasmine: [
        {
            name: "Jasmine Gajra",
            image: "",
            time: "15 minutes",
            difficulty: "Easy",
            description: "Make a traditional jasmine flower string.",
            ingredients: ["Fresh jasmine flowers", "Thread"],
            instructions: [
                "Arrange the jasmine flowers.",
                "Join them carefully with thread."
            ],
            youtube: "https://www.youtube.com/results?search_query=jasmine+gajra+making"
        },
        {
            name: "Jasmine Flower String",
            image: "",
            time: "15 minutes",
            difficulty: "Easy",
            description: "Make a jasmine string for decoration.",
            ingredients: ["Jasmine flowers", "Thread"],
            instructions: [
                "Prepare the flowers.",
                "Thread them together carefully."
            ],
            youtube: "https://www.youtube.com/results?search_query=jasmine+flower+string+making"
        }
    ],

    lily: [
        {
            name: "Lily Flower Arrangement",
            image: "",
            time: "10 minutes",
            difficulty: "Easy",
            description: "Arrange lilies in a vase for home decoration.",
            ingredients: ["Fresh lilies", "Vase", "Water"],
            instructions: [
                "Add clean water to the vase.",
                "Arrange the lilies in the vase.",
                "Place the arrangement where you want to decorate."
            ],
            youtube: "https://www.youtube.com/results?search_query=lily+flower+arrangement+DIY"
        },
        {
            name: "Lily Table Decoration",
            image: "",
            time: "10 minutes",
            difficulty: "Easy",
            description: "Create a simple flower centrepiece for a table.",
            ingredients: ["Lilies", "A vase or flower container"],
            instructions: [
                "Choose a suitable flower container.",
                "Arrange the lilies to make a centrepiece."
            ],
            youtube: "https://www.youtube.com/results?search_query=lily+flower+table+decoration"
        }
    ]
};

// Products are loaded from Firestore.
let farmerProducts = [];

const CART_KEY = "cropconnect_customer_cart";
const ORDERS_KEY = "cropconnect_customer_orders";
const PROFILE_KEY = "cropconnect_customer_profile";
const DELIVERY_FEE = 50;

let selectedCategory = null;
let selectedRecipeProduct = null;

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
// PRODUCT LISTENER
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
                        farmerId: crop.farmerId, // UID from your Firestore crop document
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

            if (selectedCategory) {
                renderCategoryProducts();

                if (selectedRecipeProduct) {
                    renderRecipeRecommendations(selectedRecipeProduct);
                }
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

    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("open");

    if (pageId === "cart") renderCart();
    if (pageId === "orders") renderOrders();
    if (pageId === "profile") loadProfile();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.toggle("open");
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
    selectedRecipeProduct = null;

    document.querySelectorAll(".category-card").forEach((card) => {
        card.classList.remove("active");
    });

    if (button) button.classList.add("active");

    const section = document.getElementById("categoryProductsSection");
    const title = document.getElementById("categoryTitle");
    const description = document.getElementById("categoryDescription");
    const grid = document.getElementById("productsGrid");
    const searchInput = document.getElementById("searchInput");

    if (!section || !title || !description || !grid) {
        console.error("Products section elements are missing from the HTML.");
        return;
    }

    section.classList.add("category-visible");

    title.textContent = category;
    description.textContent =
        `Crops listed by farmers in the ${category.toLowerCase()} category`;

    if (searchInput) searchInput.value = "";

    renderCategoryProducts();
    renderRecipeRecommendations(null);

    section.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ========================================
// RENDER PRODUCTS
// ========================================

function renderCategoryProducts() {
    const grid = document.getElementById("productsGrid");

    if (!grid || !selectedCategory) return;

    const searchInput = document.getElementById("searchInput");
    const searchText = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

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

    grid.replaceChildren();

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
            addToCart(product);
        });

        const recipeButton = document.createElement("button");
        recipeButton.type = "button";
        recipeButton.className = "recipe-toggle";
        recipeButton.textContent =
            product.category === "Flowers"
                ? "View Decoration Ideas"
                : "View Recipes";

        recipeButton.addEventListener("click", () => {
            selectedRecipeProduct = product.name;
            renderRecipeRecommendations(product.name);

            const recipeSection =
                document.getElementById("recipeRecommendations");

            if (recipeSection && !recipeSection.hidden) {
                recipeSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

        bottom.append(price, addButton);
        details.append(name, farmer, location, bottom, recipeButton);
        card.append(image, details);
        grid.appendChild(card);
    });
}

function searchProducts() {
    if (selectedCategory === null) return;

    selectedRecipeProduct = null;

    renderCategoryProducts();
    renderRecipeRecommendations(null);
}

// ========================================
// PRODUCT NAME MATCHING
// Supports product names such as "Rose 1 bunch",
// "Fresh Marigold", "Zendu", "Mogra", etc.
// ========================================

function getRecipeKey(productName) {
    const normalizedName = String(productName || "")
        .toLowerCase()
        .replace(/[^a-z\u0900-\u097f\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const cropAliases = {
        tomato: ["tomato", "tomatoes"],
        potato: ["potato", "potatoes"],
        onion: ["onion", "onions"],
        rose: ["rose", "roses", "गुलाब"],
        marigold: ["marigold", "marigolds", "zendu", "झेंडू"],
        jasmine: ["jasmine", "mogra", "mogरा", "मोगरा"],
        lily: ["lily", "lilies"]
    };

    const words = normalizedName.split(" ");

    for (const [recipeKey, aliases] of Object.entries(cropAliases)) {
        if (aliases.some((alias) => words.includes(alias))) {
            return recipeKey;
        }
    }

    return null;
}

// ========================================
// RENDER RECIPE / DECORATION IDEAS
// ========================================

function renderRecipeRecommendations(productName) {
    const section = document.getElementById("recipeRecommendations");
    const grid = document.getElementById("recipeGrid");
    const description = document.getElementById("recipeDescription");

    if (!section || !grid || !description) {
        console.warn(
            "Recipe HTML elements are missing. Check recipeRecommendations, recipeGrid, and recipeDescription IDs."
        );
        return;
    }

    if (!productName) {
        grid.replaceChildren();
        description.textContent = "";
        section.hidden = true;
        return;
    }

    const productKey = getRecipeKey(productName);
    const ideas = productKey ? recipeData[productKey] : null;

    if (!ideas || ideas.length === 0) {
        grid.replaceChildren();
        description.textContent =
            `No ideas have been added for "${productName}" yet.`;
        section.hidden = false;
        return;
    }

    const isFlower = ["rose", "marigold", "jasmine", "lily"]
        .includes(productKey);

    description.textContent = isFlower
        ? `Decoration ideas using ${productName}.`
        : `Recipe ideas using ${productName}.`;

    grid.replaceChildren();

    ideas.forEach((idea) => {
        const card = document.createElement("article");
        card.className = "recipe-card";

        const image = document.createElement("div");
        image.className = "recipe-image";

        if (idea.image) {
            const photo = document.createElement("img");
            photo.src = idea.image;
            photo.alt = idea.name;
            photo.loading = "lazy";

            photo.onerror = () => {
                photo.remove();
                image.textContent = isFlower ? "🌸" : "🌱";
            };

            image.appendChild(photo);
        } else {
            image.textContent = isFlower ? "🌸" : "🌱";
        }

        const details = document.createElement("div");
        details.className = "recipe-details";

        const title = document.createElement("h3");
        title.className = "recipe-title";
        title.textContent = idea.name;

        const summary = document.createElement("p");
        summary.className = "recipe-description";
        summary.textContent = idea.description;

        const meta = document.createElement("div");
        meta.className = "recipe-meta";
        meta.textContent = `⏱ ${idea.time} · ${idea.difficulty}`;

        const ingredients = document.createElement("div");
        ingredients.className = "recipe-ingredients";
        ingredients.textContent =
            (isFlower ? "Materials: " : "Ingredients: ") +
            idea.ingredients.join(", ");

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "recipe-toggle";
        toggle.textContent = isFlower ? "View Steps" : "View Recipe";
        toggle.setAttribute("aria-expanded", "false");

        const instructions = document.createElement("div");
        instructions.className = "recipe-instructions";
        instructions.hidden = true;

        const heading = document.createElement("strong");
        heading.textContent = isFlower ? "How to make it" : "Preparation";

        const list = document.createElement("ol");

        idea.instructions.forEach((instruction) => {
            const item = document.createElement("li");
            item.textContent = instruction;
            list.appendChild(item);
        });

        instructions.append(heading, list);

        toggle.addEventListener("click", () => {
            const isOpening = instructions.hidden;

            instructions.hidden = !isOpening;
            toggle.textContent = isOpening
                ? (isFlower ? "Hide Steps" : "Hide Recipe")
                : (isFlower ? "View Steps" : "View Recipe");

            toggle.setAttribute("aria-expanded", String(isOpening));
        });

        const youtubeLink = document.createElement("a");
        youtubeLink.className = "recipe-youtube-link";
        youtubeLink.href = idea.youtube;
        youtubeLink.target = "_blank";
        youtubeLink.rel = "noopener noreferrer";
        youtubeLink.textContent = isFlower
            ? "Watch Decoration Tutorial on YouTube"
            : "Watch Recipe on YouTube";

        details.append(
            title,
            summary,
            meta,
            ingredients,
            toggle,
            instructions,
            youtubeLink
        );

        card.append(image, details);
        grid.appendChild(card);
    });

    section.hidden = false;
}

// ========================================
// CART
// ========================================
function addToCart(product) {
    const updatedCart = cart.map((item) => ({ ...item }));

    // Identify a crop by its Firestore document ID.
    // Different farmers can list crops with the same name.
    const existingItem = updatedCart.find(
        (item) => item.cropId === product.id
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        updatedCart.push({
            cropId: product.id,
            farmerId: product.farmerId,
            name: product.name,
            price: Number(product.price),
            quantity: 1
        });
    }

    if (!writeStorage(CART_KEY, updatedCart)) return;

    cart = updatedCart;
    updateCartBadge();
    renderCart();
    showToast(`${product.name} added to cart!`);
}

function changeQuantity(cropId, amount) {
    const updatedCart = cart.map((item) => ({ ...item }));

    const item = updatedCart.find(
        (product) => product.cropId === cropId
    );

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
function removeFromCart(cropId) {
    const updatedCart = cart.filter(
        (item) => item.cropId !== cropId
    );

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
        container.replaceChildren();

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
            minus.type = "button";
            minus.textContent = "−";
            minus.onclick = () => changeQuantity(item.cropId, -1);

            const quantity = document.createElement("span");
            quantity.textContent = item.quantity;

            const plus = document.createElement("button");
            plus.type = "button";
            plus.textContent = "+";
            plus.onclick = () => changeQuantity(item.cropId, 1);
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "remove-btn";
            remove.innerHTML = '<i class="fa-solid fa-trash"></i>';
            remove.setAttribute("aria-label", `Remove ${item.name}`);
            remove.onclick = () => removeFromCart(item.cropId);

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

    const summaryItems = document.getElementById("summaryItems");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const deliveryFee = document.getElementById("deliveryFee");
    const cartTotal = document.getElementById("cartTotal");

    if (summaryItems) summaryItems.textContent = count;
    if (cartSubtotal) cartSubtotal.textContent = "₹" + subtotal;
    if (deliveryFee) deliveryFee.textContent = "₹" + delivery;
    if (cartTotal) cartTotal.textContent = "₹" + (subtotal + delivery);
}

// ========================================
// PLACE ORDER (BROWSER-LOCAL)
// ========================================
async function placeOrder() {
    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    const customer = auth.currentUser;

    if (!customer) {
        showToast("Please log in before placing an order.");
        return;
    }

    // Each cart item must have the crop ID and farmer UID.
    if (cart.some((item) => !item.cropId || !item.farmerId)) {
        showToast("A cart item is missing its farmer details. Remove it and add the crop again.");
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    // Group cart items by farmer. Each farmer receives only their own
    // products in their own Firestore order document.
    const itemsByFarmer = new Map();

    cart.forEach((item) => {
        if (!itemsByFarmer.has(item.farmerId)) {
            itemsByFarmer.set(item.farmerId, []);
        }

        itemsByFarmer.get(item.farmerId).push({
            cropId: item.cropId,
            cropName: item.name,
            quantity: Number(item.quantity),
            unitPrice: Number(item.price),
            itemTotal: Number(item.price) * Number(item.quantity)
        });
    });

    const farmerGroups = Array.from(itemsByFarmer.entries());

    // Keep the existing ₹50 delivery fee once for the whole cart.
    // For the demo, allocate it to the first farmer's order.
    try {
        for (let index = 0; index < farmerGroups.length; index++) {
            const [farmerId, products] = farmerGroups[index];

            const farmerSubtotal = products.reduce(
                (sum, item) => sum + item.itemTotal,
                0
            );

            const allocatedDeliveryFee = index === 0 ? DELIVERY_FEE : 0;

            await addDoc(collection(db, "orders"), {
                customerId: customer.uid,
                customerName:
                    `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
                    || customer.displayName
                    || customer.email
                    || "Customer",

                farmerId,
                products,

                subtotal: farmerSubtotal,
                deliveryFee: allocatedDeliveryFee,
                amount: farmerSubtotal + allocatedDeliveryFee,

                status: "Processing",
                createdAt: serverTimestamp()
            });
        }

        // Keep a local copy for the customer's existing My Orders display.
        const newOrder = {
            id: "CC" + Date.now().toString().slice(-8),
            products: cart.map((item) => ({ ...item })),
            amount: subtotal + DELIVERY_FEE,
            date: new Date().toLocaleDateString("en-IN"),
            status: "Processing"
        };

        const updatedOrders = [newOrder, ...orders];

        if (!writeStorage(ORDERS_KEY, updatedOrders)) {
            showToast("Order was saved online, but could not be saved in this browser.");
            return;
        }

        if (!writeStorage(CART_KEY, [])) {
            showToast("Order was saved online, but the cart could not be cleared.");
            return;
        }

        orders = updatedOrders;
        cart = [];

        updateCartBadge();
        renderCart();
        renderOrders();
        showToast("Order placed successfully!");
        showPage("orders");

    } catch (error) {
        console.error("Firestore order creation failed:", error);
        showToast("Could not place order. Check your connection and Firestore rules.");
    }
}

function renderOrders() {
    const table = document.getElementById("ordersTable");
    if (!table) return;

    table.replaceChildren();

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
    const fields = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
    };

    Object.entries(fields).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field) field.value = value || "";
    });

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

    const headerName = document.getElementById("headerName");
    const profileDisplayName = document.getElementById("profileDisplayName");

    if (headerName) headerName.textContent = fullName;
    if (profileDisplayName) profileDisplayName.textContent = fullName;

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
        if (!avatar) return;

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

    const photoInput = document.getElementById("photoInput");
    if (photoInput) photoInput.value = "";

    showToast("Profile photo removed.");
}

// ========================================
// LOGOUT + TOAST
// ========================================

function logout() {
    if (!confirm("Are you sure you want to log out?")) return;

    // Change this path if your login page is located elsewhere.
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
// EXPOSE HTML INLINE HANDLERS
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
    selectedRecipeProduct = null;

    const categorySection =
        document.getElementById("categoryProductsSection");

    if (categorySection) {
        categorySection.classList.remove("category-visible");
    }

    const recipeSection =
        document.getElementById("recipeRecommendations");

    if (recipeSection) {
        recipeSection.hidden = true;
    }

    updateCartBadge();
    renderCart();
    renderOrders();
    loadProfile();

    listenForFarmerProducts();

    console.log("CropConnect customer dashboard initialized.");
});
