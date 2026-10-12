
// =========================
// SAUVEGARDE DES MATIÈRES
// =========================

const boutonsSauvegarde =
    document.querySelectorAll(".save-button");

boutonsSauvegarde.forEach(function (bouton) {

    bouton.addEventListener("click", function () {

        const service = bouton.closest(".service");

        const note =
            service.querySelector(".note-input").value;

        const commentaire =
            service.querySelector(".commentaire-input").value;

        // Pour l'instant, on sauvegarde dans le navigateur.
        localStorage.setItem(
            "service-" + service.dataset.service,
            JSON.stringify({
                note: note,
                commentaire: commentaire
            })
        );

        // Petit retour visuel
        bouton.textContent = "Sauvegardé ✓";

        setTimeout(function () {
            bouton.textContent = "Sauvegarder";
        }, 1500);

    });

});


// =========================
// CHARGEMENT DES DONNÉES
// =========================

document.querySelectorAll(".service").forEach(function (service) {

    const sauvegarde =
        localStorage.getItem(
            "service-" + service.dataset.service
        );

    if (sauvegarde) {

        const donnees = JSON.parse(sauvegarde);

        service.querySelector(".note-input").value =
            donnees.note;

        service.querySelector(".commentaire-input").value =
            donnees.commentaire;
    }

});


// =========================
// DÉCONNEXION
// =========================

const boutonDeconnexion =
    document.getElementById("logoutButton");

boutonDeconnexion.addEventListener("click", function () {

    window.location.href = "index.html";

});
