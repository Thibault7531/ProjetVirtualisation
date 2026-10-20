const API_URL = "http://127.0.0.1:8000";

const listeServices = document.querySelector(".services");
const boutonDeconnexion = document.getElementById("logoutButton");

async function chargerServices() {
    const role = localStorage.getItem("role");

    // Vérifier que l'utilisateur est bien un prestataire
    if (!role || role.toUpperCase() !== "PRESTATAIRE") {
        window.location.href = "index.html";
        return;
    }

    listeServices.innerHTML = "<p>Chargement des services...</p>";

    try {
        const reponse = await fetch(`${API_URL}/api/services/`, {
            method: "GET",
            credentials: "include"
        });

        const donnees = await reponse.json();

        if (!reponse.ok) {
            listeServices.innerHTML =
                `<p>${donnees.message || "Impossible de charger les services."}</p>`;
            return;
        }

        listeServices.innerHTML = "";

        if (!donnees.services || donnees.services.length === 0) {
            listeServices.innerHTML =
                "<p>Tu n'as aucun service pour le moment.</p>";
            return;
        }

        // Créer un bouton pour chaque service renvoyé par Django
        donnees.services.forEach(service => {
            const bouton = document.createElement("button");

            bouton.classList.add("service");
            bouton.dataset.service = service.id_service;
            bouton.textContent = service.intitule;

            bouton.addEventListener("click", () => {
                window.location.href =
                    `evaluation.html?service=${service.id_service}`;
            });

            listeServices.appendChild(bouton);
        });

    } catch (erreur) {
        console.error("Erreur lors du chargement des services :", erreur);

        listeServices.innerHTML =
            "<p>Impossible de contacter le serveur Django.</p>";
    }
}

boutonDeconnexion.addEventListener("click", () => {
    localStorage.removeItem("id_compte");
    localStorage.removeItem("role");
    localStorage.removeItem("login");

    window.location.href = "index.html";
});

chargerServices();