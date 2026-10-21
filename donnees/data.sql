USE ProjetVirt;


-- =========================================================
-- COMPTES
-- =========================================================

INSERT INTO COMPTE
(id_compte, login, mot_de_passe_hash, role, statut)
VALUES
    -- Prestataires
    (1, 'jdupont', 'pbkdf2_sha256$1500000$FNw8a6UJXVKNva8IbLqhRl$VLX6nCebcEOop961CVrpau3lT45aie2oTijnvzhzRng=', 'PRESTATAIRE', 'VALIDE'),
    (2, 'smartin', 'pbkdf2_sha256$1500000$W829FNytHRYk2f1OdLaIEM$hPfLAdA/nD7CDBmYTBpXrhpMtuVooaUvjI9g3KxNEIE=', 'PRESTATAIRE', 'VALIDE'),
    (3, 'lbernard', 'pbkdf2_sha256$1500000$iYnffNvF4cWrEzt7BDXMps$UKFuTZIwBYwHAz5uwXjtXLkg4o31m8RC3asezFNiU/M=', 'PRESTATAIRE', 'VALIDE'),
    (4, 'epetit', 'pbkdf2_sha256$1500000$wRtx0pqWPOWHHoNjT3sO4D$xzcu6JZqyQ0rhYfn9yn+m60560gPbTteqhuf9NwpwIQ=', 'PRESTATAIRE', 'VALIDE'),
    (5, 'trobert', 'pbkdf2_sha256$1500000$LULmawIjHxPJdP7sOHB8Cb$0uvkvIzSV6LpZJhg4TGL1wqL7Y84ZhSuBCqjM0Pwlyw=', 'PRESTATAIRE', 'VALIDE'),

    -- Clients
    (6, 'adurand', 'pbkdf2_sha256$1500000$0RJSIecplHQTjNVsCEU1px$dTVHSihNmWuxcTqSsY3RjDwRLjiqcH1UEU4US/aHdeA=', 'CLIENT', 'VALIDE'),
    (7, 'hmoreau', 'pbkdf2_sha256$1500000$0UlnIsuN6YBLnnD4T27p6j$V9omIb4h28QqvBEFDfxfjphKR/LeVRB4iUnaRrIniAc=', 'CLIENT', 'VALIDE'),
    (8, 'cleroy', 'pbkdf2_sha256$1500000$lh79arzEnQZpIEIqnYRlls$BxSbD2qsNudTwSr6QGdjms7/OYUv4begbGRH7E8Yyfo=', 'CLIENT', 'VALIDE'),
    (9, 'nsimon', 'pbkdf2_sha256$1500000$ketlnejtFidZOMDvgVLhwf$0NKWDqkVYt18qPou3ub8UW/6nD6yrlaWtM8BFnLFmrk=', 'CLIENT', 'VALIDE'),
    (10, 'llaurent', 'pbkdf2_sha256$1500000$Wsobot9fzD2WGKEXMN4kSH$kzGHrR4FFEHteYH3qZZsBiR15AKms4m7XZalgd34lJ8=', 'CLIENT', 'VALIDE'),
    (11, 'lmichel', 'pbkdf2_sha256$1500000$21lZM2IrBrX9FR9pXCWIsv$ELJIJTAaOxno5/pwlvYFKebgS76bWCIlubXfMng0Yks=', 'CLIENT', 'VALIDE'),
    (13, 'pgarnier', 'pbkdf2_sha256$1500000$IU6uMtaFFe4UVitprMrrsq$S3pyBSaEqKI8NUShRxioIeSqVnfFX/8Y9q5IPUlyv2Y=', 'CLIENT', 'VALIDE'),
    (14, 'bfaurie', 'pbkdf2_sha256$1500000$m1JbGZcYfPGE9IBAGDxGrv$4gI4F38rgo6i9BHPJSvmcMELam4+K4dZc4Ej/ya2Kx4=', 'CLIENT', 'VALIDE'),
    (15, 'cvincent', 'pbkdf2_sha256$1500000$x1p8sUAvQJZH8KpcQ08HhQ$UsgV65JrtAAZkdaZDcXhiVz0fXFTwJ4CCIzCNl61Pc4=', 'CLIENT', 'VALIDE'),
    (16, 'tmartin', 'pbkdf2_sha256$1500000$QXb68K7oiJE5ABAkLPGc6w$Jxj8sBbglqjKxKER5rsKLkoLGYAtYjbH2XUDGHu1+kU=', 'CLIENT', 'VALIDE'),
    (17, 'jbernard', 'pbkdf2_sha256$1500000$PqYdwjzP5NAXV61RnNF8Yb$cMv6JJCT7TLz2f0x60Y+ctB/CtzUolnw0Hi/S1r0a/k=', 'CLIENT', 'VALIDE'),
    (18, 'srobert', 'pbkdf2_sha256$1500000$vIYmoqSV5LtHVDOG8r7fcl$cf5JyGwN/9+VgEvMsN9eeIXhxx9CsN4TS9pljGjrHRw=', 'CLIENT', 'VALIDE'),
    (19, 'mrichard', 'pbkdf2_sha256$1500000$8Z0ACtpeTABm4NMbpkZKxX$N3c73zsjYKYBIA+A4qhA4HUU80sKGNLKKr0OfTyvOxg=', 'CLIENT', 'VALIDE'),
    (20, 'pdubois', 'pbkdf2_sha256$1500000$zgBZEdfCBHoNvDPwqj06od$1we93IFRVCnDRi/P6zxlce5aAFkFeZHF5iMx7dMi5rM=', 'CLIENT', 'VALIDE'),
    (21, 'jthomas', 'pbkdf2_sha256$1500000$5s3B0X3uHqMapS8nFLVJA5$fmPRhmMzENUBHsVbgP7DIfe6HpxnCMwubLFUbWSKito=', 'CLIENT', 'VALIDE'),
    (22, 'csimon', 'pbkdf2_sha256$1500000$ohs02ztWevYv1Ktl5dUOhY$uVgKE1vqfG385SGWubDzzk76tJsqNxgYUXGukpFQ9EM=', 'CLIENT', 'VALIDE'),
    (23, 'mlaurent', 'pbkdf2_sha256$1500000$gXYnuIxCl9PtpakhCjE3kc$yTWc9yvZe988smHt5BvbWLgZ5oOYaQCR1i8dSMr+OG4=', 'CLIENT', 'VALIDE'),
    (24, 'blefevre', 'pbkdf2_sha256$1500000$dWRWA83JtlgxlyutGTfWE3$c/Rrle0I4viPwCSZpmkRk8kqcPhuQV0FQMld2ecJkgk=', 'CLIENT', 'VALIDE'),
    (25, 'dmichel', 'pbkdf2_sha256$1500000$3Jdjm15VJvjFR4aoX88Go5$/J06wop5Ytu7jOX5HiCQLusjIFYKlL1I/P8XkF1dBNc=', 'CLIENT', 'VALIDE'),
    (26, 'ogarcia', 'pbkdf2_sha256$1500000$cNRnifWz5pMFJXCfEjLRji$P6i1dHkJScfC/nCfGAEfzxdkTE/AmVSdSGJzcoMJr0E=', 'CLIENT', 'VALIDE'),

    -- Admins
    (12, 'admin', 'pbkdf2_sha256$1500000$h72p09BFy1qmUyl9k9x4qL$wo2T56i/gwrl7IdxlB0JxT6kLa2KhYXp0XbLZifufqA=', 'ADMIN', 'VALIDE');


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
    (6, 11, 'Michel', 'Louis', 'louis.michel@example.com'),
    (7, 13, 'Garnier', 'Paul', 'paul.garnier@example.com'),
    (8, 14, 'Faurie', 'Benoît', 'benoit.faurie@example.com'),
    (9, 15, 'Vincent', 'Camille', 'camille.vincent@example.com'),
    (10, 16, 'Martin', 'Théo', 'theo.martin@example.com'),
    (11, 17, 'Bernard', 'Juliette', 'juliette.bernard@example.com'),
    (12, 18, 'Robert', 'Samuel', 'samuel.robert@example.com'),
    (13, 19, 'Richard', 'Manon', 'manon.richard@example.com'),
    (14, 20, 'Dubois', 'Pierre', 'pierre.dubois@example.com'),
    (15, 21, 'Thomas', 'Julie', 'julie.thomas@example.com'),
    (16, 22, 'Simon', 'Clément', 'clement.simon@example.com'),
    (17, 23, 'Laurent', 'Mathilde', 'mathilde.laurent@example.com'),
    (18, 24, 'Lefèvre', 'Benjamin', 'benjamin.lefevre@example.com'),
    (19, 25, 'Michel', 'David', 'david.michel@example.com'),
    (20, 26, 'Garcia', 'Océane', 'oceane.garcia@example.com');


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
    (1, 1, 4, 'Très bon service, travail sérieux.'),
    (2, 1, 4, 'Résultat très satisfaisant.'),
    (3, 1, 5, 'Excellent travail et très bonne communication.'),

    (4, 2, 4, 'Bon travail, quelques corrections nécessaires.'),
    (5, 2, 4, 'Service efficace et rapide.'),

    (1, 3, 5, 'Très créatif et professionnel.'),
    (3, 3, 5, 'Très beau résultat.'),
    (6, 3, 5, 'Parfait, rien à redire.'),

    (2, 4, 4, 'Bonne idée mais quelques modifications nécessaires.'),
    (4, 4, 4, 'Logo réussi.'),

    (1, 5, 5, 'Problème résolu rapidement.'),
    (2, 5, 5, 'Très efficace.'),
    (5, 5, 5, 'Très bon service.'),

    (3, 6, 5, 'Installation rapide et efficace.'),
    (6, 6, 4, 'Bon service.'),

    (1, 7, 5, 'Très bonne pédagogie.'),
    (2, 7, 5, 'Explications claires et utiles.'),
    (4, 7, 4, 'Bon accompagnement.'),

    (3, 8, 4, 'Traduction de qualité.'),
    (5, 8, 4, 'Très bon travail.'),

    (2, 9, 5, 'Très belles photos.'),
    (4, 9, 5, 'Excellent travail, photos magnifiques.'),
    (6, 9, 4, 'Très professionnel.'),

    (1, 10, 4, 'Bon résultat.'),
    (3, 10, 4, 'Retouches réussies.'),
    (5, 10, 5, 'Très satisfait du résultat.'),

    (7, 1, 4, 'Très satisfait de la création du site web.'),
    (7, 5, 5, 'Intervention rapide et efficace.'),

    (8, 3, 4, 'Beau travail de création graphique.'),
    (8, 8, 4, 'Traduction fluide et professionnelle.'),

    (9, 2, 4, 'Bonne structure front-end.'),
    (9, 10, 4, 'Retouche photo très soignée.'),

    (5, 7, 4, 'Cours très instructifs.'),
    (6, 4, 5, 'Logo original et bien conçu.'),

    (10, 1, 5, 'Très bon service, création rapide.'),
    (11, 2, 4, 'Développement front-end propre.'),
    (12, 3, 5, 'Design graphique remarquable.'),
    (13, 4, 4, 'Logo très professionnel.'),
    (14, 5, 5, 'Dépannage informatique parfait.'),
    (15, 6, 3, 'Installation de logiciels réussie.'),
    (16, 7, 4, 'Excellents cours de langue.'),
    (17, 8, 4, 'Traduction fidèle et soignée.'),
    (18, 9, 5, 'Superbes photos souvenir.'),
    (19, 10, 4, 'Retouche photo de qualité.'),
    (20, 1, 5, 'Prestation globale irréprochable.');