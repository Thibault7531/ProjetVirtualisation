/*
         * Ouverture de la page des notes
         * correspondant à la service sélectionnée.
         */

const services =
    document.querySelectorAll(".service");

services.forEach(function (service) {

    service.addEventListener("click", function () {

        const numeroService =
            this.dataset.service;

        window.location.href =
            "evaluation.html?service="
            + numeroService;
    });

});


/*
 * Déconnexion
 */

const logoutButton =
    document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {

    window.location.href = "index.html";

});