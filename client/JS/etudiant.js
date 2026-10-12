
// =========================
// SAUVEGARDE DES MATIÈRES
// =========================

const boutonsSauvegarde =
    document.querySelectorAll(".save-button");

boutonsSauvegarde.forEach(function (bouton) {

    bouton.addEventListener("click", function () {

        const matiere = bouton.closest(".matiere");

        const note =
            matiere.querySelector(".note-input").value;

        const commentaire =
            matiere.querySelector(".commentaire-input").value;

        // Pour l'instant, on sauvegarde dans le navigateur.
        localStorage.setItem(
            "matiere-" + matiere.dataset.matiere,
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

document.querySelectorAll(".matiere").forEach(function (matiere) {

    const sauvegarde =
        localStorage.getItem(
            "matiere-" + matiere.dataset.matiere
        );

    if (sauvegarde) {

        const donnees = JSON.parse(sauvegarde);

        matiere.querySelector(".note-input").value =
            donnees.note;

        matiere.querySelector(".commentaire-input").value =
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
