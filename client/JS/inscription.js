// =========================
// CONFIGURATION API
// =========================

const API_URL = "http://127.0.0.1:8000";


// =========================
// TYPE DE COMPTE
// =========================

const typeCompteButton =
    document.getElementById("typeCompteButton");

const typeCompteMenu =
    document.getElementById("typeCompteMenu");

const typeCompteTexte =
    document.getElementById("typeCompteTexte");

let typeCompte = "Client";


// =========================
// OUVRIR / FERMER LE MENU
// =========================

typeCompteButton.addEventListener("click", function () {

    typeCompteMenu.classList.toggle("visible");

});


// =========================
// CHOIX D'UN TYPE
// =========================

typeCompteMenu
    .querySelectorAll("button")
    .forEach(function (bouton) {

        bouton.addEventListener("click", function () {

            typeCompte =
                bouton.dataset.type === "prestataire"
                    ? "Prestataire"
                    : "Client";

            typeCompteTexte.textContent =
                bouton.textContent.trim();

            typeCompteMenu.classList.remove("visible");

        });

    });


// =========================
// FERMER LE MENU AILLEURS
// =========================

document.addEventListener("click", function (event) {

    if (
        !typeCompteButton.contains(event.target) &&
        !typeCompteMenu.contains(event.target)
    ) {

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


formulaire.addEventListener("submit", async function (event) {

    event.preventDefault();


    // =========================
    // RÉCUPÉRATION DES CHAMPS
    // =========================

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


    erreur.style.display = "none";


    // =========================
    // VÉRIFICATION
    // =========================

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


    try {

        // =========================
        // APPEL API
        // =========================

        const params = new URLSearchParams({

            login: identifiant,
            password: motDePasse,
            role: typeCompte,
            nom: nom,
            prenom: prenom,
            email: email

        });


        const response = await fetch(
            `${API_URL}/api/register/?${params.toString()}`
        );


        const data = await response.json();


        console.log("Réponse inscription :", data);


        // =========================
        // INSCRIPTION RÉUSSIE
        // =========================

        if (data.status === "success") {

            alert(
                "Inscription réussie ! Votre compte doit être validé avant de pouvoir vous connecter."
            );

            window.location.href = "index.html";

            return;
        }


        // =========================
        // ERREUR API
        // =========================

        erreur.textContent =
            data.message || "Erreur lors de l'inscription.";

        erreur.style.display = "block";


    } catch (error) {

        console.error(
            "Erreur lors de l'inscription :",
            error
        );

        erreur.textContent =
            "Impossible de contacter le serveur.";

        erreur.style.display = "block";
    }

});


// =========================
// RETOUR À LA CONNEXION
// =========================

const retourConnexion =
    document.getElementById("retourConnexion");


retourConnexion.addEventListener("click", function () {

    window.location.href = "index.html";

});
