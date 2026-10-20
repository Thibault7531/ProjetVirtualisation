from django.db import models

class Compte(models.Model):
    id_compte = models.IntegerField(primary_key=True)
    login = models.CharField(max_length=255)
    mot_de_passe_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    statut = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'COMPTE'

class Prestataire(models.Model):
    id_prestataire = models.IntegerField(primary_key=True)
    id_compte = models.IntegerField()
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'PRESTATAIRE'

class Client(models.Model):
    id_client = models.IntegerField(primary_key=True)
    id_compte = models.IntegerField()
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'CLIENT'

class Service(models.Model):
    id_service = models.IntegerField(primary_key=True)
    intitule = models.CharField(max_length=255)
    id_prestataire = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'SERVICE'

class Note(models.Model):
    pk = models.CompositePrimaryKey("id_client", "id_service")
    id_client = models.IntegerField()
    id_service = models.IntegerField()
    valeur = models.IntegerField()
    commentaire = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'NOTE'