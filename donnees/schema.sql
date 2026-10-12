DROP DATABASE ProjetVirt;

CREATE DATABASE IF NOT EXISTS ProjetVirt;

USE ProjetVirt;

CREATE TABLE COMPTE (
    id_compte INT PRIMARY KEY,
    login CHAR(255),
    mot_de_passe_hash CHAR(255),
    role CHAR(255),
    statut CHAR(255),
    id_personne INT,
    UNIQUE (login)
);

CREATE TABLE ENSEIGNANT (
    id_enseignant INT PRIMARY KEY,
    nom CHAR(255),
    prenom CHAR(255),
    email CHAR(255)
);

CREATE TABLE ETUDIANT (
    id_etudiant INT PRIMARY KEY,
    nom CHAR(255),
    prenom CHAR(255),
    email CHAR(255)
);

CREATE TABLE COURS (
    id_cours INT PRIMARY KEY,
    code CHAR(255),
    intitule CHAR(255),
    id_enseignant INT,
    CONSTRAINT FOREIGN KEY (id_enseignant) REFERENCES ENSEIGNANT(id_enseignant)
);

CREATE TABLE NOTE (
    id_etudiant INT NOT NULL,
    id_cours INT NOT NULL,
    valeur INT,
    commentaire CHAR(255),
    PRIMARY KEY (id_etudiant, id_cours),
    CONSTRAINT CHECK (valeur <= 20 AND valeur >= 0)
)