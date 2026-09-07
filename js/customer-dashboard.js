/* =========================================================
   CUSTOMER DASHBOARD JAVASCRIPT
========================================================= */


/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [

    {
        id: 1,
        name: "Organic Wheat",
        farmer: "Green Fields Farm",
        location: "Pune",
        price: 45,
        icon: "fa-wheat-awn"
    },

    {
        id: 2,
        name: "Fresh Carrots",
        farmer: "Sunshine Agro",
        location: "Nashik",
        price: 35,
        icon: "fa-carrot"
    },

    {
        id: 3,
        name: "Red Apples",
        farmer: "Valley Orchards",
        location: "Satara",
        price: 120,
        icon: "fa-apple-whole"
    },

    {
        id: 4,
        name: "Fresh Lemons",
        farmer: "Citrus Farm",
        location: "Baramati",
        price: 60,
        icon: "fa-lemon"
    }

];


/* =========================================================
   CART
========================================================= */

let cart = [];


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId, element) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {

        page.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {

        item.classList.remove("active");

    });


    if (element) {

        element.classList.add("active");

    }


    const sidebar =
        document.getElementById("sidebar");


    if (sidebar) {

        sidebar.classList.remove("mobile-open");

    }


    if (pageId === "product-detail") {

        renderAllProducts();

    }


    if (pageId === "cart") {

        renderCart();

    }

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    sidebar.classList.toggle("mobile-open");

}


/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

function addToCart(productName, price) {

    const existingProduct =
        cart.find(item =>
            item.name === productName
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            name: productName,

            price: price,

            quantity: 1

        });

    }


    updateCartCount();

    showToast(
        `${productName} added to cart 🛒`
    );

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const badge =
        document.getElementById("cartBadge");


    const cartCount =
        document.getElementById("cartCount");


    if (badge) {

        badge.textContent =
            totalQuantity;

    }


    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const container =
        document.getElementById("cartItems");


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>Your cart is empty</h3>

                <p>
                    Add fresh crops from the marketplace.
                </p>

            </div>

        `;


        updateCartSummary();

        return;

    }


    cart.forEach((item, index) => {

        const product =
            products.find(
                p => p.name === item.name
            );


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-icon">

                <i class="fa-solid ${product ? product.icon : "fa-seedling"}"></i>

            </div>


            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    ₹${item.price} / kg
                </p>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="changeQuantity(${index}, -1)"
                >
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    onclick="changeQuantity(${index}, 1)"
                >
                    +
                </button>

            </div>


            <strong>
                ₹${item.price * item.quantity}
            </strong>


            <button
                class="remove-btn"
                onclick="removeFromCart(${index})"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        `;


        container.appendChild(cartItem);

    });


    updateCartSummary();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(index, amount) {

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    updateCartCount();

    renderCart();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(index) {

    const item =
        cart[index];


    cart.splice(index, 1);


    updateCartCount();

    renderCart();


    showToast(
        `${item.name} removed from cart.`
    );

}


/* =========================================================
   CART SUMMARY
========================================================= */

function updateCartSummary() {

    const itemCount =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    const delivery =
        cart.length > 0
            ? 50
            : 0;


    const total =
        subtotal + delivery;


    const summaryItems =
        document.getElementById(
            "summaryItems"
        );


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (summaryItems) {

        summaryItems.textContent =
            itemCount;

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${subtotal}`;

    }


    if (totalElement) {

        totalElement.textContent =
            `₹${total}`;

    }

}


/* =========================================================
   RENDER ALL PRODUCTS
========================================================= */

function renderAllProducts() {

    const grid =
        document.getElementById(
            "allProductsGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    products.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-image">

                <i class="fa-solid ${product.icon}"></i>

            </div>


            <div class="product-details">

                <div class="product-title">

                    ${product.name}

                </div>


                <div class="farmer-name">

                    <i class="fa-solid fa-user"></i>

                    ${product.farmer}

                </div>


                <div class="location">

                    <i class="fa-solid fa-location-dot"></i>

                    ${product.location}

                </div>


                <div class="product-bottom">

                    <span class="price">

                        ₹${product.price} / kg

                    </span>


                    <button
                        class="add-cart-btn"
                        onclick="addToCart('${product.name}', ${product.price})"
                    >

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =========================================================
   SEARCH PRODUCTS
========================================================= */

function searchProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const productCards =
        document.querySelectorAll(
            "#productsGrid .product-card"
        );


    productCards.forEach(card => {

        const productName =
            card.dataset.name
                .toLowerCase();


        if (
            productName.includes(
                searchText
            )
        ) {

            card.style.display =
                "block";

        } else {

            card.style.display =
                "none";

        }

    });

}


/* =========================================================
   PLACE ORDER
========================================================= */

function placeOrder() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;

    }


    const orderId =
        "#CC" +
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        ) + 50;


    cart = [];


    updateCartCount();

    renderCart();


    showToast(
        `Order ${orderId} placed successfully! Total ₹${total}`
    );


    setTimeout(() => {

        showPage(
            "orders",
            document.querySelectorAll(
                ".nav-item"
            )[3]
        );

    }, 1200);

}


/* =========================================================
   PROFILE
========================================================= */

function saveProfile(event) {

    event.preventDefault();


    const firstName =
        document.getElementById(
            "firstName"
        ).value;


    const lastName =
        document.getElementById(
            "lastName"
        ).value;


    const fullName =
        `${firstName} ${lastName}`;


    document.getElementById(
        "headerName"
    ).textContent = fullName;


    document.getElementById(
        "profileDisplayName"
    ).textContent = fullName;


    const initials =
        (
            firstName.charAt(0) +
            lastName.charAt(0)
        ).toUpperCase();


    document.querySelector(
        ".avatar"
    ).textContent = initials;


    document.querySelector(
        ".profile-avatar-large"
    ).textContent = initials;


    showToast(
        "Profile updated successfully! ✓"
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    const confirmation =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmation) {

        return;

    }


    showToast(
        "Logging out..."
    );


    setTimeout(() => {

        /*
           When your login page is ready,
           change this to your actual login page.

           Example:

           window.location.href =
               "../login.html";
        */

        window.location.href =
            "../index.html";

    }, 1000);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".toast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(() => {

        toast.remove();

    }, 2500);

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        renderAllProducts();

    }
);