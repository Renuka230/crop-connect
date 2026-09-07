const roleButtons = document.querySelectorAll(".role-buttons .role-btn");

roleButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active from all role buttons
        roleButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Add active only to the clicked button
        this.classList.add("active");

    });

});