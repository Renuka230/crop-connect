const roleButtons = document.querySelectorAll(".role-btn");

roleButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active from all buttons
        roleButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Add active to clicked button
        this.classList.add("active");

    });

});