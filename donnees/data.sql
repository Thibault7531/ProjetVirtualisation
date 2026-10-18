USE ProjetVirt;


-- =========================================================
-- COMPTES
-- =========================================================

INSERT INTO COMPTE
(id_compte, login, mot_de_passe_hash, role, statut, id_personne)
VALUES
    -- Prestataires
    (1, 'jdupont', 'hash123', 'PRESTATAIRE', 'VALIDE', 1),
    (2, 'smartin', 'hash456', 'PRESTATAIRE', 'VALIDE', 2),
    (3, 'lbernard', 'hash789', 'PRESTATAIRE', 'VALIDE', 3),
    (4, 'epetit', 'hash012', 'PRESTATAIRE', 'VALIDE', 4),
    (5, 'trobert', 'hash345', 'PRESTATAIRE', 'VALIDE', 5),

    -- Clients
    (6, 'adurand', 'hash111', 'CLIENT', 'VALIDE', 1),
    (7, 'hmoreau', 'hash222', 'CLIENT', 'VALIDE', 2),
    (8, 'cleroy', 'hash333', 'CLIENT', 'VALIDE', 3),
    (9, 'nsimon', 'hash444', 'CLIENT', 'VALIDE', 4),
    (10, 'llaurent', 'hash555', 'CLIENT', 'VALIDE', 5),
    (11, 'lmichel', 'hash666', 'CLIENT', 'VALIDE', 6),

    -- Admins
    (12, 'admin', 'hash999', 'ADMIN', 'VALIDE', 999);


-- =========================================================
-- PRESTATAIRES
-- =========================================================

INSERT INTO PRESTATAIRE
    (id_prestataire, id_compte, nom, prenom, email)
VALUES
    (1, 1, 'Dupont', 'Jean', 'jean.dupont@example.com'),
    (2, 2, 'Martin', 'Sophie', 'sophie.martin@example.com'),
    (3, 3, 'Bernard', 'Lucas', 'lucas.bernard@example.com'),
    (4, 4, 'Petit', 'Emma', 'emma.petit@example.com'),
    (5, 5, 'Robert', 'Thomas', 'thomas.robert@example.com');


-- =========================================================
-- CLIENTS
-- =========================================================

INSERT INTO CLIENT
    (id_client, id_compte, nom, prenom, email)
VALUES
    (1, 6, 'Durand', 'Alice', 'alice.durand@example.com'),
    (2, 7, 'Moreau', 'Hugo', 'hugo.moreau@example.com'),
    (3, 8, 'Leroy', 'Chloé', 'chloe.leroy@example.com'),
    (4, 9, 'Simon', 'Nathan', 'nathan.simon@example.com'),
    (5, 10, 'Laurent', 'Léa', 'lea.laurent@example.com'),
    (6, 11, 'Michel', 'Louis', 'louis.michel@example.com');


-- =========================================================
-- SERVICES
-- =========================================================

INSERT INTO SERVICE
    (id_service, intitule, id_prestataire)
VALUES
    (1, 'Création de site web', 1),
    (2, 'Développement front-end', 1),
    (3, 'Création graphique', 2),
    (4, 'Conception de logo', 2),
    (5, 'Dépannage informatique', 3),
    (6, 'Installation de logiciels', 3),
    (7, 'Cours de langue anglaise', 4),
    (8, 'Traduction français-anglais', 4),
    (9, 'Photographie événementielle', 5),
    (10, 'Retouche photo', 5);


-- =========================================================
-- NOTES
-- =========================================================

INSERT INTO NOTE
    (id_client, id_service, valeur, commentaire)
VALUES
    (1, 1, 18, 'Très bon service, travail sérieux.'),
    (2, 1, 16, 'Résultat très satisfaisant.'),
    (3, 1, 19, 'Excellent travail et très bonne communication.'),

    (4, 2, 15, 'Bon travail, quelques corrections nécessaires.'),
    (5, 2, 17, 'Service efficace et rapide.'),

    (1, 3, 19, 'Très créatif et professionnel.'),
    (3, 3, 18, 'Très beau résultat.'),
    (6, 3, 20, 'Parfait, rien à redire.'),

    (2, 4, 14, 'Bonne idée mais quelques modifications nécessaires.'),
    (4, 4, 16, 'Logo réussi.'),

    (1, 5, 20, 'Problème résolu rapidement.'),
    (2, 5, 18, 'Très efficace.'),
    (5, 5, 19, 'Très bon service.'),

    (3, 6, 17, 'Installation rapide et efficace.'),
    (6, 6, 15, 'Bon service.'),

    (1, 7, 18, 'Très bonne pédagogie.'),
    (2, 7, 19, 'Explications claires et utiles.'),
    (4, 7, 17, 'Bon accompagnement.'),

    (3, 8, 16, 'Traduction de qualité.'),
    (5, 8, 18, 'Très bon travail.'),

    (2, 9, 19, 'Très belles photos.'),
    (4, 9, 20, 'Excellent travail, photos magnifiques.'),
    (6, 9, 18, 'Très professionnel.'),

    (1, 10, 17, 'Bon résultat.'),
    (3, 10, 16, 'Retouches réussies.'),
    (5, 10, 19, 'Très satisfait du résultat.');