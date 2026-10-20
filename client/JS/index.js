// =========================
// CONNEXION
// =========================

const boutonConnexion =
    document.getElementById("buttonLiquidGlassText");

const erreur =
    document.getElementById("erreur-connexion");


boutonConnexion.addEventListener("click", async function () {

    const identifiant =
        document.getElementById("identifiant").value.trim();

    const motDePasse =
        document.getElementById("motDePasse").value;


    // Réinitialiser le message d'erreur

    erreur.style.display = "none";


    // Vérification des champs

    if (!identifiant || !motDePasse) {

        erreur.textContent =
            "Veuillez remplir tous les champs.";

        erreur.style.display = "block";

        return;
    }


    try {

        // Appel de l'API Django

        const response = await fetch(
            `/api/login/?username=${encodeURIComponent(identifiant)}&password=${encodeURIComponent(motDePasse)}`
        );


        // Conversion de la réponse en JSON

        const data = await response.json();


        console.log("Réponse API :", data);


        // =========================
        // CONNEXION RÉUSSIE
        // =========================

        if (data.status === "success") {

            // On sauvegarde les informations
            // nécessaires pour les prochaines pages

            localStorage.setItem(
                "id_compte",
                data.id
            );

            localStorage.setItem(
                "role",
                data.role
            );

            localStorage.setItem(
                "login",
                identifiant
            );


            // =========================
            // REDIRECTION SELON LE ROLE
            // =========================

            const role = data.role.toUpperCase();


            if (role === "CLIENT") {

                window.location.href = "client.html";

            } else if (role === "PRESTATAIRE") {

                window.location.href = "prestataire.html";

            } else if (role === "ADMIN") {

                window.location.href = "validation.html";

            } else {

                erreur.textContent =
                    "Rôle du compte inconnu.";

                erreur.style.display = "block";
            }


            return;
        }


        // =========================
        // ERREUR API
        // =========================

        erreur.textContent = data.message ||
            "Identifiant ou mot de passe incorrect.";

        erreur.style.display = "block";


    } catch (error) {

        console.error(
            "Erreur lors de la connexion à l'API :",
            error
        );

        erreur.textContent =
            "Impossible de contacter le serveur.";

        erreur.style.display = "block";
    }

});


// =========================
// INSCRIPTION
// =========================

const boutonInscription =
    document.getElementById("buttonLiquidGlassText1");


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
