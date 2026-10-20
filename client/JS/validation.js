const API_URL = "http://127.0.0.1:8000";

const listeAttente = document.getElementById("listeAttente");
const listeValides = document.getElementById("listeValides");
const boutonDeconnexion = document.getElementById("logoutButton");

async function chargerComptes() {
    const role = localStorage.getItem("role");

    if (!role || role.toUpperCase() !== "ADMIN") {
        window.location.href = "index.html";
        return;
    }

    try {
        const reponse = await fetch(`${API_URL}/api/compte-en-attente`, {
            credentials: "include"
        });

        const donnees = await reponse.json();

        if (!reponse.ok) {
            throw new Error(donnees.message || "Impossible de charger les comptes.");
        }

        afficherComptes(
            listeAttente,
            donnees.comptes_en_attente || [],
            true
        );

        afficherComptes(
            listeValides,
            donnees.comptes_valides || [],
            false
        );
    } catch (erreur) {
        console.error(erreur);
        listeAttente.textContent = "Impossible de charger les comptes.";
    }
}

function afficherComptes(conteneur, comptes, enAttente) {
    conteneur.innerHTML = "";

    if (comptes.length === 0) {
        conteneur.textContent = enAttente
            ? "Aucun compte en attente."
            : "Aucun compte validé.";
        return;
    }

    comptes.forEach(compte => {
        const ligne = document.createElement("div");
        ligne.classList.add("compte");

        const informations = document.createElement("p");
        informations.textContent =
            `${compte.prenom} ${compte.nom} — ${compte.email} (${compte.role})`;

        ligne.appendChild(informations);

        if (enAttente) {
            const boutonValider = document.createElement("button");
            boutonValider.textContent = "Valider";

            boutonValider.addEventListener("click", async () => {
                try {
                    const url = new URL(`${API_URL}/api/valider-compte`);
                    url.searchParams.set("account_id", compte.id_compte);

                    const resultat = await fetch(url, {
                        credentials: "include"
                    });

                    const retour = await resultat.json();

                    if (!resultat.ok || retour.status === "error") {
                        alert(retour.message || "Validation impossible.");
                        return;
                    }

                    await chargerComptes();
                } catch (erreur) {
                    console.error(erreur);
                    alert("Impossible de contacter Django.");
                }
            });

            ligne.appendChild(boutonValider);
        }

        conteneur.appendChild(ligne);
    });
}

boutonDeconnexion.addEventListener("click", () => {
    localStorage.removeItem("id_compte");
    localStorage.removeItem("role");
    localStorage.removeItem("login");
    window.location.href = "index.html";
});

chargerComptes();