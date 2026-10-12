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

CREATE TABLE PRESTATAIRE (
    id_prestataire INT PRIMARY KEY,
    nom CHAR(255),
    prenom CHAR(255),
    email CHAR(255)
);

CREATE TABLE CLIENT (
    id_client INT PRIMARY KEY,
    nom CHAR(255),
    prenom CHAR(255),
    email CHAR(255)
);

CREATE TABLE SERVICE (
    id_service INT PRIMARY KEY,
    intitule CHAR(255),
    id_prestataire INT,
    CONSTRAINT FOREIGN KEY (id_prestataire) REFERENCES PRESTATAIRE(id_prestataire)
);

CREATE TABLE NOTE (
    id_client INT NOT NULL,
    id_service INT NOT NULL,
    valeur INT,
    commentaire CHAR(255),
    PRIMARY KEY (id_client, id_service),
    CONSTRAINT CHECK (valeur <= 20 AND valeur >= 0)
)