// =========================
// TYPE DE COMPTE
// =========================

const typeCompteButton =
    document.getElementById("typeCompteButton");

const typeCompteMenu =
    document.getElementById("typeCompteMenu");

const typeCompteTexte =
    document.getElementById("typeCompteTexte");

let typeCompte = "etudiant";


// Ouvrir / fermer le menu

typeCompteButton.addEventListener("click", function () {

    typeCompteMenu.classList.toggle("visible");

});


// Choix d'un type

typeCompteMenu
    .querySelectorAll("button")
    .forEach(function (bouton) {

        bouton.addEventListener("click", function () {

            typeCompte = bouton.dataset.type;

            typeCompteTexte.textContent =
                bouton.textContent.trim();

            typeCompteMenu.classList.remove("visible");

        });

    });


// Fermer le menu si on clique ailleurs

document.addEventListener("click", function (event) {

    if (!typeCompteButton.contains(event.target) &&
        !typeCompteMenu.contains(event.target)) {

        typeCompteMenu.classList.remove("visible");

    }

});


// =========================
// INSCRIPTION
// =========================

const formulaire =
    document.getElementById("formulaireInscription");

const erreur =
    document.getElementById("erreur-inscription");


formulaire.addEventListener("submit", function (event) {

    event.preventDefault();


    const nom =
        document.getElementById("nom").value.trim();

    const prenom =
        document.getElementById("prenom").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const identifiant =
        document.getElementById("identifiant").value.trim();

    const motDePasse =
        document.getElementById("motDePasse").value;


    // Vérification

    if (
        !nom ||
        !prenom ||
        !email ||
        !identifiant ||
        !motDePasse
    ) {

        erreur.textContent =
            "Veuillez remplir tous les champs.";

        erreur.style.display = "block";

        return;
    }


    // Sauvegarde provisoire

    const utilisateur = {

        nom: nom,
        prenom: prenom,
        email: email,
        identifiant: identifiant,
        motDePasse: motDePasse,
        typeCompte: typeCompte

    };


    localStorage.setItem(
        "utilisateur",
        JSON.stringify(utilisateur)
    );


    // Retour à la connexion

    window.location.href = "index.html";

});


// =========================
// RETOUR À LA CONNEXION
// =========================

const retourConnexion =
    document.getElementById("retourConnexion");

retourConnexion.addEventListener("click", function () {

    window.location.href = "index.html";

});