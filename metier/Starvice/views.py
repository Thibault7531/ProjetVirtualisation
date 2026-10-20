import time
import json
from random import randint

from django.db.models import Model
from django.http import HttpResponse
from django.http.response import HttpResponseForbidden, JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.http import require_GET, require_POST
from .models import Compte, Prestataire, Client, Note, Service


def login(request):
    username = request.GET.get('username', '')
    password = request.GET.get('password', '')

    if username == '' or password == '':
        return JsonResponse({
            "status": "error",
            "message": "Username or password cannot be empty"
        }, status=400)

    account = Compte.objects.filter(login=username).first()

    if account is None:
        return JsonResponse({
            "status": "error",
            "message": "Account not found"
        }, status=401)

    if account.statut == 'NONVALIDE':
        return JsonResponse({
            "status": "error",
            "message": "Account not validated"
        }, status=403)

    if not check_password(password, account.mot_de_passe_hash):
        return JsonResponse({
            "status": "error",
            "message": "Invalid password"
        }, status=401)

    # Création de la session Django
    request.session["id_compte"] = account.id_compte
    request.session["role"] = account.role

    return JsonResponse({
        "status": "success",
        "message": "Login successful",
        "id": account.id_compte,
        "role": account.role
    })

def register(request):
    login = request.GET.get('login', '')
    password = request.GET.get('password', '')
    role = request.GET.get('role', '')
    nom = request.GET.get('nom', '')
    prenom = request.GET.get('prenom', '')
    email = request.GET.get('email', '')

    if Compte.objects.filter(login=login).exists():
        data = {
            "status": "error",
            "message": "Login already exists"
        }
        return JsonResponse(data)

    if login == '' or password == '' or role == '' or nom == '' or prenom == '' or email == '':
        data = {
            "status": "error",
            "message": "All fields are required"
        }
        return JsonResponse(data)

    if role not in ['Client', 'Prestataire']:
        data = {
            "status": "error",
            "message": "Invalid role"
        }
        return JsonResponse(data)

    passwordHash = make_password(password)
    id = randint(1, 1000000)
    Compte.objects.create(id_compte=id, login=login, mot_de_passe_hash=passwordHash, role=role, statut="NONVALIDE")
    compte = Compte.objects.filter(id_compte=id)
    while not compte.exists():
        time.sleep(0.1)
        compte = Compte.objects.filter(id_compte=id)

    if role == "Client":
        idEtudiant = randint(1, 1000000)
        Client.objects.create(id_client=idEtudiant, id_compte=id, nom=nom, prenom=prenom, email=email)

    if role == "Prestataire":
        idEnseignant = randint(1, 1000000)
        Prestataire.objects.create(id_prestataire=idEnseignant, id_compte=id, nom=nom, prenom=prenom, email=email)

    data = {
        "status": "success",
        "message": "Registration successful"
    }
    return JsonResponse(data)

def getGrades(request):
    login = request.GET.get('login')
    password = request.GET.get('password')
    test = request.GET.get('test')

    if login == '' or password == '':
        data = {
            "status": "error",
            "message": "Username or password cannot be empty"
        }
        return JsonResponse(data)

    item = Compte.objects.filter(login=login)

    if not item.exists():
        data = {
            "status": "error",
            "message": "Account not found"
        }
        return JsonResponse(data)

    account = item.first()

    if account.statut == 'NONVALIDE':
        data = {
            "status": "error",
            "message": "Account not validated"
        }
        return JsonResponse(data)

    if test == 0:
        if not check_password(password, account.mot_de_passe_hash):
            data = {
                "status": "error",
                "message": "Invalid password"
            }
            return JsonResponse(data)
    elif test == 1:
        if not password == account.mot_de_passe_hash:
            data = {
                "status": "error",
                "message": "Invalid password"
            }
            return JsonResponse(data)

    client = Client.objects.filter(id_compte=account.id_compte).first()
    if not client:
        data = {
            "status": "error",
            "message": "Client not found"
        }
        return JsonResponse(data)

    notes = Note.objects.filter(id_client=client.id_client)
    data = {
        "status": "success",
        "message": "Notes retrieved successfully",
        "notes": []
    }
    for note in notes:
        service = Service.objects.filter(id_service=note.id_service).first()
        prestataire = Prestataire.objects.filter(id_prestataire=service.id_prestataire).first()
        data["notes"].append({
            "id_client": note.id_client,
            "id_prestataire": prestataire.id_prestataire,
            "nom_prestataire": prestataire.nom,
            "prenom_prestataire": prestataire.prenom,
            "id_service": service.id_service,
            "intitule": service.intitule,
            "note": note.valeur,
            "commentaire": note.commentaire
        })
    return JsonResponse(data)

def getService(request):
    # Vérifier que l'utilisateur est connecté
    id_compte = request.session.get("id_compte")

    if not id_compte:
        return JsonResponse(
            {"status": "error", "message": "Utilisateur non connecté"},
            status=401
        )

    try:
        compte = Compte.objects.get(id_compte=id_compte)
    except Compte.DoesNotExist:
        return JsonResponse(
            {"status": "error", "message": "Compte introuvable"},
            status=401
        )

    # Vérifier le rôle et la validation du compte
    if compte.role.upper() != "PRESTATAIRE":
        return JsonResponse(
            {"status": "error", "message": "Accès réservé aux prestataires"},
            status=403
        )

    if compte.statut.upper() != "VALIDE":
        return JsonResponse(
            {"status": "error", "message": "Compte non validé"},
            status=403
        )

    # Récupérer le profil du prestataire
    try:
        prestataire = Prestataire.objects.get(id_compte=compte.id_compte)
    except Prestataire.DoesNotExist:
        return JsonResponse(
            {"status": "error", "message": "Profil prestataire introuvable"},
            status=404
        )

    # Récupérer ses services
    services = Service.objects.filter(
        id_prestataire=prestataire.id_prestataire
    )

    liste_services = [
        {
            "id_service": service.id_service,
            "intitule": service.intitule
        }
        for service in services
    ]

    return JsonResponse({
        "status": "success",
        "services": liste_services
    })

def getServiceGrades(request, service_id):
    compte = compte_connecte(request)

    if compte is None:
        return JsonResponse(
            {"message": "Utilisateur non connecté"},
            status=401
        )

    if compte.role.upper() != "PRESTATAIRE":
        return JsonResponse(
            {"message": "Accès réservé aux prestataires"},
            status=403
        )

    try:
        prestataire = Prestataire.objects.get(id_compte=compte.id_compte)
        service = Service.objects.get(
            id_service=service_id,
            id_prestataire=prestataire.id_prestataire
        )
    except (Prestataire.DoesNotExist, Service.DoesNotExist):
        return JsonResponse(
            {"message": "Service introuvable ou accès refusé"},
            status=404
        )

    notes = Note.objects.filter(id_service=service.id_service)
    resultat = []

    for note in notes:
        client = Client.objects.get(id_client=note.id_client)

        resultat.append({
            "valeur": note.valeur,
            "commentaire": note.commentaire,
            "nom_client": client.nom,
            "prenom_client": client.prenom
        })

    return JsonResponse({
        "status": "success",
        "intitule": service.intitule,
        "notes": resultat
    })

def getAccountPendingValidation(request):
    compte = compte_connecte(request)

    if compte is None or compte.role.upper() != "ADMIN":
        return JsonResponse(
            {"message": "Accès réservé aux administrateurs"},
            status=403
        )

    comptes = Compte.objects.all()
    en_attente = []
    valides = []

    for compte_cible in comptes:
        role = compte_cible.role.upper()

        if role not in ("CLIENT", "PRESTATAIRE"):
            continue

        if role == "CLIENT":
            profil = Client.objects.filter(
                id_compte=compte_cible.id_compte
            ).first()
        else:
            profil = Prestataire.objects.filter(
                id_compte=compte_cible.id_compte
            ).first()

        entree = {
            "id_compte": compte_cible.id_compte,
            "login": compte_cible.login,
            "role": role,
            "nom": profil.nom if profil else "",
            "prenom": profil.prenom if profil else "",
            "email": profil.email if profil else ""
        }

        if compte_cible.statut.upper() == "NONVALIDE":
            en_attente.append(entree)
        elif compte_cible.statut.upper() == "VALIDE":
            valides.append(entree)

    return JsonResponse({
        "comptes_en_attente": en_attente,
        "comptes_valides": valides
    })

def validateAccount(request):
    login = request.GET.get('login')
    password = request.GET.get('password')
    test = request.GET.get('test')
    account_id = request.GET.get('account_id')

    if login == '' or password == '':
        data = {
            "status": "error",
            "message": "Username or password cannot be empty"
        }
        return JsonResponse(data)

    item = Compte.objects.filter(login=login)

    if not item.exists():
        data = {
            "status": "error",
            "message": "Account not found"
        }
        return JsonResponse(data)

    account = item.first()

    if account.statut == 'NONVALIDE':
        data = {
            "status": "error",
            "message": "Account not validated"
        }
        return JsonResponse(data)

    if test == 0:
        if not check_password(password, account.mot_de_passe_hash):
            data = {
                "status": "error",
                "message": "Invalid password"
            }
            return JsonResponse(data)
    elif test == 1:
        if not password == account.mot_de_passe_hash:
            data = {
                "status": "error",
                "message": "Invalid password"
            }
            return JsonResponse(data)

    if not account.role == "ADMIN":
        data = {
            "status": "error",
            "message": "Unauthorized"
        }
        return JsonResponse(data)

    accounts = Compte.objects.filter(id_compte=account_id)
    if not accounts.exists():
        data = {
            "status": "error",
            "message": "Account not found"
        }
        return JsonResponse(data)

    account = accounts.first()
    if account.statut == 'VALIDE':
        data = {
            "status": "error",
            "message": "Account already validated"
        }
        return JsonResponse(data)

    account.statut = 'VALIDE';
    account.save()
    data = {
        "status": "success",
        "message": "Account validated"
    }
    return JsonResponse(data)

def compte_connecte(request):
    id_compte = request.session.get("id_compte")

    if not id_compte:
        return None

    try:
        compte = Compte.objects.get(id_compte=id_compte)
    except Compte.DoesNotExist:
        return None

    return compte

@require_GET
def catalogue_services(request):
    compte = compte_connecte(request)

    if compte is None or compte.role.upper() != "CLIENT":
        return JsonResponse(
            {"message": "Accès réservé aux clients connectés"},
            status=401
        )

    services = Service.objects.all()
    resultat = []

    for service in services:
        prestataire = Prestataire.objects.get(
            id_prestataire=service.id_prestataire
        )

        resultat.append({
            "id_service": service.id_service,
            "intitule": service.intitule,
            "id_prestataire": prestataire.id_prestataire,
            "nom_prestataire": prestataire.nom,
            "prenom_prestataire": prestataire.prenom
        })

    return JsonResponse({"services": resultat})

@require_POST
def enregistrer_note(request):
    compte = compte_connecte(request)

    if compte is None or compte.role.upper() != "CLIENT":
        return JsonResponse(
            {"message": "Accès réservé aux clients connectés"},
            status=401
        )

    try:
        donnees = json.loads(request.body)
        id_service = int(donnees["id_service"])
        valeur = int(donnees["valeur"])
        commentaire = str(
            donnees.get("commentaire", "")
        ).strip()

    except (ValueError, TypeError, KeyError, json.JSONDecodeError):
        return JsonResponse(
            {"message": "Données invalides"},
            status=400
        )

    if not 1 <= valeur <= 5:
        return JsonResponse(
            {"message": "La note doit être comprise entre 1 et 5"},
            status=400
        )

    try:
        client = Client.objects.get(
            id_compte=compte.id_compte
        )

        service = Service.objects.get(
            id_service=id_service
        )

    except (Client.DoesNotExist, Service.DoesNotExist):
        return JsonResponse(
            {"message": "Client ou service introuvable"},
            status=404
        )

    note_existante = Note.objects.filter(
        id_client=client.id_client,
        id_service=service.id_service
    )

    if note_existante.exists():
        note_existante.update(
            valeur=valeur,
            commentaire=commentaire
        )
    else:
        Note.objects.create(
            id_client=client.id_client,
            id_service=service.id_service,
            valeur=valeur,
            commentaire=commentaire
        )

    return JsonResponse({
        "status": "success",
        "message": "Évaluation enregistrée"
    })
