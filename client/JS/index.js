// =========================
// CONNEXION
// =========================

const boutonConnexion = document.getElementById("buttonLiquidGlassText");

boutonConnexion.addEventListener("click", function () {

    const identifiant = document.getElementById("identifiant").value;
    const motDePasse = document.getElementById("motDePasse").value;

    const erreur = document.getElementById("erreur-connexion");

    // =========================
    // COMPTES TEMPORAIRES DE TEST
    // =========================

    // Étudiant
    if (identifiant === "d25024703" && motDePasse === "mdp") {

        window.location.href = "etudiant.html";
        return;
    }

    // Professeur
    if (identifiant === "professeur" && motDePasse === "mdp") {

        window.location.href = "professeur.html";
        return;
    }

    // Admin
    if (identifiant === "admin" && motDePasse === "mdp") {

        window.location.href = "validation.html";
        return;
    }

    // =========================
    // IDENTIFIANTS INCORRECTS
    // =========================

    erreur.style.display = "block";
});


// =========================
// INSCRIPTION
// =========================

const boutonInscription = document.getElementById("buttonLiquidGlassText1");

boutonInscription.addEventListener("click", function () {

    window.location.href = "inscription.html";

});


// =========================
// VALIDATION AVEC ENTRÉE
// =========================

document.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        boutonConnexion.click();
    }

});