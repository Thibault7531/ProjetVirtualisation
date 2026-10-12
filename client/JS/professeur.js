/*
         * Ouverture de la page des notes
         * correspondant à la matière sélectionnée.
         */

const matieres =
    document.querySelectorAll(".matiere");

matieres.forEach(function (matiere) {

    matiere.addEventListener("click", function () {

        const numeroMatiere =
            this.dataset.matiere;

        window.location.href =
            "notes_cours.html?matiere="
            + numeroMatiere;
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