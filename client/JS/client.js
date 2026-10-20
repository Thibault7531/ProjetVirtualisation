const API_URL = "http://127.0.0.1:8000";

const boutonDeconnexion = document.getElementById("logoutButton");

async function chargerServicesClient() {
    const role = localStorage.getItem("role");

    if (!role || role.toUpperCase() !== "CLIENT") {
        window.location.href = "index.html";
        return;
    }

    const corpsTableau = document.querySelector(".notes");

    if (!corpsTableau) {
        console.error("Impossible de trouver la section .notes.");
        return;
    }

    // Supprimer les anciennes lignes sans supprimer l'en-tête
    corpsTableau.querySelectorAll(".service, .message-chargement").forEach(
        element => element.remove()
    );

    afficherMessage(corpsTableau, "Chargement des services...");

    try {
        // Récupérer les services disponibles
        const reponse = await fetch(`${API_URL}/catalogue-services/`, {
            credentials: "include"
        });

        const donnees = await reponse.json();

        if (!reponse.ok) {
            throw new Error(
                donnees.message || "Impossible de charger les services."
            );
        }

        // Récupérer les notes déjà laissées par le client
        const notesReponse = await fetch(`${API_URL}/notes/`, {
            credentials: "include"
        });

        const notesDonnees = await notesReponse.json();

        if (!notesReponse.ok) {
            throw new Error(
                notesDonnees.message || "Impossible de charger les notes."
            );
        }

        // Associer chaque note à son service
        const notesParService = new Map(
            (notesDonnees.notes || []).map(note => [
                String(note.id_service),
                note
            ])
        );

        // Retirer le message de chargement
        corpsTableau.querySelectorAll(".message-chargement").forEach(
            element => element.remove()
        );

        if (!donnees.services || donnees.services.length === 0) {
            afficherMessage(corpsTableau, "Aucun service disponible.");
            return;
        }

        // Créer une ligne pour chaque service
        donnees.services.forEach(service => {
            const noteExistante = notesParService.get(
                String(service.id_service)
            );

            const ligne = document.createElement("div");
            ligne.classList.add("service");
            ligne.dataset.service = service.id_service;

            // Nom du service
            const nomService = document.createElement("div");
            nomService.classList.add("service-nom");
            nomService.textContent = service.intitule;

            // Nom du prestataire
            const nomPrestataire = document.createElement("div");
            nomPrestataire.classList.add("prestataire");
            nomPrestataire.textContent =
                `${service.prenom_prestataire} ${service.nom_prestataire}`;

            // Champ de note
            const zoneNote = document.createElement("div");
            zoneNote.classList.add("note");

            const inputNote = document.createElement("input");
            inputNote.type = "number";
            inputNote.min = "1";
            inputNote.max = "5";
            inputNote.step = "1";
            inputNote.classList.add("note-input");
            inputNote.value = noteExistante ? noteExistante.note : "";
            inputNote.setAttribute("aria-label", "Note sur 5");

            zoneNote.appendChild(inputNote);

            // Champ de commentaire
            const zoneCommentaire = document.createElement("div");
            zoneCommentaire.classList.add("commentaire");

            const inputCommentaire = document.createElement("input");
            inputCommentaire.type = "text";
            inputCommentaire.classList.add("commentaire-input");
            inputCommentaire.value = noteExistante
                ? (noteExistante.commentaire || "")
                : "";
            inputCommentaire.placeholder = "Ton commentaire";
            inputCommentaire.setAttribute("aria-label", "Commentaire");

            zoneCommentaire.appendChild(inputCommentaire);

            // Bouton d'enregistrement
            const boutonEnregistrer = document.createElement("button");
            boutonEnregistrer.type = "button";
            boutonEnregistrer.classList.add("save-button");
            boutonEnregistrer.textContent = "Sauvegarder";

            boutonEnregistrer.addEventListener("click", async () => {
                const valeur = Number(inputNote.value);
                const commentaire = inputCommentaire.value.trim();

                if (
                    inputNote.value.trim() === "" ||
                    !Number.isInteger(valeur) ||
                    valeur < 1 ||
                    valeur > 5
                ) {
                    alert("Choisis une note entière entre 1 et 5.");
                    return;
                }

                boutonEnregistrer.disabled = true;

                try {
                    const resultat = await fetch(
                        `${API_URL}/enregistrer-note/`,
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id_service: service.id_service,
                                valeur: valeur,
                                commentaire: commentaire
                            })
                        }
                    );

                    const retour = await resultat.json();

                    if (!resultat.ok) {
                        alert(
                            retour.message ||
                            "L'enregistrement a échoué."
                        );
                        return;
                    }

                    // Mettre à jour la note mémorisée dans la page
                    notesParService.set(String(service.id_service), {
                        id_service: service.id_service,
                        note: valeur,
                        commentaire: commentaire
                    });

                    alert("Évaluation enregistrée !");
                } catch (erreur) {
                    console.error(erreur);
                    alert("Impossible de contacter Django.");
                } finally {
                    boutonEnregistrer.disabled = false;
                }
            });

            // Assembler la ligne
            ligne.append(
                nomService,
                nomPrestataire,
                zoneNote,
                zoneCommentaire,
                boutonEnregistrer
            );

            corpsTableau.appendChild(ligne);
        });

    } catch (erreur) {
        console.error(erreur);

        corpsTableau.querySelectorAll(".service, .message-chargement").forEach(
            element => element.remove()
        );

        afficherMessage(
            corpsTableau,
            erreur.message || "Impossible de contacter Django."
        );
    }
}

// Afficher un message sans supprimer l'en-tête
function afficherMessage(conteneur, texte) {
    const message = document.createElement("p");
    message.classList.add("message-chargement");
    message.textContent = texte;
    conteneur.appendChild(message);
}

// Déconnexion côté navigateur
boutonDeconnexion.addEventListener("click", () => {
    localStorage.removeItem("id_compte");
    localStorage.removeItem("role");
    localStorage.removeItem("login");

    window.location.href = "index.html";
});

// Charger les services à l'ouverture de la page
chargerServicesClient();