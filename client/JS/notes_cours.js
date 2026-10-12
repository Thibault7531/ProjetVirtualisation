// =========================
// CALCUL DE LA MOYENNE
// =========================

function calculerMoyenne() {

    const notes =
        document.querySelectorAll(".etudiant .note");

    let total = 0;
    let nombreNotes = 0;

    notes.forEach(function (noteElement) {

        // Remplace la virgule française par un point
        const valeur =
            parseFloat(
                noteElement.textContent
                    .trim()
                    .replace(",", ".")
            );

        if (!isNaN(valeur)) {

            total += valeur;
            nombreNotes++;

        }

    });


    const moyenne =
        nombreNotes > 0
            ? total / nombreNotes
            : 0;


    document.getElementById("noteMoyenne").textContent =
        moyenne.toFixed(2).replace(".", ",");

}


// Calcul au chargement
calculerMoyenne();


// =========================
// RETOUR
// =========================

const boutonRetour =
    document.getElementById("buttonRetour");

boutonRetour.addEventListener("click", function () {

    window.location.href = "professeur.html";

});


// =========================
// DÉCONNEXION
// =========================

const boutonDeconnexion =
    document.getElementById("buttonDeconnexion");

boutonDeconnexion.addEventListener("click", function () {

    window.location.href = "index.html";

});