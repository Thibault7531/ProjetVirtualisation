CREATE TABLE COMPTE (
    id_compte INT PRIMARY KEY,
    login TEXT,
    mot_de_passe_hash TEXT,
    role TEXT,
    statut TEXT,
    id_personne INT,
    UNIQUE (login)
);

CREATE TABLE ENSEIGNANT (
    id_enseignant INT PRIMARY KEY,
    nom TEXT,
    prenom TEXT,
    email TEXT
);

CREATE TABLE ETUDIANT (
    id_etudiant INT PRIMARY KEY,
    nom TEXT,
    prenom TEXT,
    email TEXT
);

CREATE TABLE COURS (
    id_cours INT PRIMARY KEY,
    code TEXT,
    intitule TEXT,
    id_enseignant INT,
    CONSTRAINT FOREIGN KEY (id_enseignant) REFERENCES ENSEIGNANT(id_enseignant)
);

CREATE TABLE NOTE (
    id_etudiant INT PRIMARY KEY,
    id_cours INT PRIMARY KEY,
    valeur INT,
    commentaire TEXT,
    CONSTRAINT CHECK (valeur <= 20 AND valeur >= 0)
)