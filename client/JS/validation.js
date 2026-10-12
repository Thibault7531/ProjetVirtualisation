/* =========================
           COMPTES DE DÉMONSTRATION
           ========================= */

const comptesAttenteParDefaut = [
    {
        id: 1,
        nom: "Professeur 1",
        email: "Professeur1@gmail.com",
        type: "Professeur"
    },
    {
        id: 2,
        nom: "Professeur 2",
        email: "Professeur2@gmail.com",
        type: "Professeur"
    },
    {
        id: 3,
        nom: "Etudiant 1",
        email: "Etudiant1@gmail.com",
        type: "Étudiant"
    },
    {
        id: 4,
        nom: "Etudiant 2",
        email: "Etudiant2@gmail.com",
        type: "Étudiant"
    },
    {
        id: 5,
        nom: "Etudiant 3",
        email: "Etudiant3@gmail.com",
        type: "Étudiant"
    }
];


/* =========================
   RÉCUPÉRATION DES COMPTES
   ========================= */

let comptesAttente =
    JSON.parse(
        localStorage.getItem("comptesEnAttente")
    );

let comptesValides =
    JSON.parse(
        localStorage.getItem("comptesValides")
    ) || [];


if (!comptesAttente) {

    comptesAttente =
        comptesAttenteParDefaut;

    localStorage.setItem(
        "comptesEnAttente",
        JSON.stringify(comptesAttente)
    );
}


/* =========================
   AFFICHAGE
   ========================= */

function afficherComptes() {

    afficherComptesAttente();
    afficherComptesValides();
}


/* =========================
   COMPTES EN ATTENTE
   ========================= */

function afficherComptesAttente() {

    const liste =
        document.getElementById("listeAttente");

    liste.innerHTML = "";


    if (comptesAttente.length === 0) {

        const message =
            document.createElement("div");

        message.className = "aucun-compte";

        message.textContent =
            "Aucun compte en attente.";

        liste.appendChild(message);

        return;
    }


    comptesAttente.forEach(function (compte) {

        const ligne =
            document.createElement("div");

        ligne.className = "compte";

        ligne.innerHTML = `

                    <div class="nom-compte">
                        ${compte.nom}
                    </div>

                    <div class="email-compte">
                        ${compte.email}
                    </div>

                    <div class="type-compte">
                        ${compte.type}
                    </div>

                    <div class="actions-compte">

                        <button
                            class="button-valider"
                            type="button"
                            data-id="${compte.id}">
                            Valider
                        </button>

                        <button
                            class="button-refuser"
                            type="button"
                            data-id="${compte.id}">
                            Refuser
                        </button>

                    </div>
                `;

        liste.appendChild(ligne);
    });


    ajouterEvenementsAttente();
}


/* =========================
   COMPTES VALIDÉS
   ========================= */

function afficherComptesValides() {

    const liste =
        document.getElementById("listeValides");

    liste.innerHTML = "";


    if (comptesValides.length === 0) {

        const message =
            document.createElement("div");

        message.className = "aucun-compte";

        message.textContent =
            "Aucun compte validé.";

        liste.appendChild(message);

        return;
    }


    comptesValides.forEach(function (compte) {

        const ligne =
            document.createElement("div");

        ligne.className = "compte";

        ligne.innerHTML = `

                    <div class="nom-compte">
                        ${compte.nom}
                    </div>

                    <div class="email-compte">
                        ${compte.email}
                    </div>

                    <div class="type-compte">
                        ${compte.type}
                    </div>

                    <div class="actions-compte">

                        <button
                            class="button-supprimer"
                            type="button"
                            data-id="${compte.id}">
                            Supprimer
                        </button>

                    </div>
                `;

        liste.appendChild(ligne);
    });


    ajouterEvenementsValides();
}


/* =========================
   BOUTONS EN ATTENTE
   ========================= */

function ajouterEvenementsAttente() {

    document
        .querySelectorAll(".button-valider")
        .forEach(function (bouton) {

            bouton.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);

                    validerCompte(id);
                }
            );
        });


    document
        .querySelectorAll(".button-refuser")
        .forEach(function (bouton) {

            bouton.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);

                    refuserCompte(id);
                }
            );
        });
}


/* =========================
   BOUTON SUPPRIMER
   ========================= */

function ajouterEvenementsValides() {

    document
        .querySelectorAll(".button-supprimer")
        .forEach(function (bouton) {

            bouton.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);

                    supprimerCompte(id);
                }
            );
        });
}


/* =========================
   VALIDER
   ========================= */

function validerCompte(id) {

    const compte =
        comptesAttente.find(function (compte) {
            return compte.id === id;
        });

    if (!compte) {
        return;
    }


    comptesValides.push(compte);


    comptesAttente =
        comptesAttente.filter(function (compte) {
            return compte.id !== id;
        });


    sauvegarder();
}


/* =========================
   REFUSER
   ========================= */

function refuserCompte(id) {

    comptesAttente =
        comptesAttente.filter(function (compte) {
            return compte.id !== id;
        });


    sauvegarder();
}


/* =========================
   SUPPRIMER
   ========================= */

function supprimerCompte(id) {

    comptesValides =
        comptesValides.filter(function (compte) {
            return compte.id !== id;
        });


    sauvegarder();
}


/* =========================
   SAUVEGARDE
   ========================= */

function sauvegarder() {

    localStorage.setItem(
        "comptesEnAttente",
        JSON.stringify(comptesAttente)
    );

    localStorage.setItem(
        "comptesValides",
        JSON.stringify(comptesValides)
    );

    afficherComptes();
}


/* =========================
   DÉCONNEXION
   ========================= */

document
    .getElementById("logoutButton")
    .addEventListener("click", function () {

        window.location.href =
            "index.html";

    });


/* =========================
   PREMIER AFFICHAGE
   ========================= */

afficherComptes();