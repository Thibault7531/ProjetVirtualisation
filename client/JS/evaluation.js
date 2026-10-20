const API_URL = "http://127.0.0.1:8000";

const listeClients = document.querySelector(".liste-clients");
const titreService = document.querySelector(".service-titre");
const noteMoyenne = document.getElementById("noteMoyenne");
const boutonRetour = document.getElementById("buttonRetour");
const boutonDeconnexion = document.getElementById("buttonDeconnexion");

async function chargerEvaluations() {
    const role = localStorage.getItem("role");
    const idService = new URLSearchParams(window.location.search).get("service");

    if (!role || role.toUpperCase() !== "PRESTATAIRE" || !idService) {
        window.location.href = "index.html";
        return;
    }

    listeClients.innerHTML = "<p>Chargement des évaluations...</p>";

    try {
        const reponse = await fetch(
            `${API_URL}/services/${encodeURIComponent(idService)}/notes`,
            { credentials: "include" }
        );

        const donnees = await reponse.json();

        if (!reponse.ok) {
            listeClients.innerHTML =
                `<p>${donnees.message || "Impossible de charger les évaluations."}</p>`;
            return;
        }

        titreService.textContent = donnees.intitule;
        listeClients.innerHTML = "";

        if (!donnees.notes || donnees.notes.length === 0) {
            listeClients.innerHTML = "<p>Aucune évaluation pour ce service.</p>";
            noteMoyenne.textContent = "—";
            return;
        }

        let total = 0;

        donnees.notes.forEach(note => {
            total += Number(note.valeur);

            const ligne = document.createElement("div");
            ligne.classList.add("client");

            const nom = document.createElement("p");
            nom.classList.add("nom-client");
            nom.textContent = `${note.prenom_client} ${note.nom_client}`;

            const valeur = document.createElement("p");
            valeur.classList.add("note");
            valeur.textContent = `${note.valeur}/5`;

            const commentaire = document.createElement("p");
            commentaire.classList.add("commentaire");
            commentaire.textContent = note.commentaire || "Aucun commentaire";

            ligne.append(nom, valeur, commentaire);
            listeClients.appendChild(ligne);
        });

        noteMoyenne.textContent =
            (total / donnees.notes.length).toFixed(2) + " / 5";

    } catch (erreur) {
        console.error(erreur);
        listeClients.innerHTML =
            "<p>Impossible de contacter le serveur Django.</p>";
    }
}

boutonRetour.addEventListener("click", () => {
    window.location.href = "prestataire.html";
});

boutonDeconnexion.addEventListener("click", () => {
    localStorage.removeItem("id_compte");
    localStorage.removeItem("role");
    localStorage.removeItem("login");
    window.location.href = "index.html";
});

chargerEvaluations();