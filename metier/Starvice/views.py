import time
from random import randint

from django.db.models import Model
from django.http import HttpResponse
from django.http.response import HttpResponseForbidden, JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from .models import Compte, Prestataire, Client, Note, Service


def login(request):
    username = request.GET.get('username', '')
    password = request.GET.get('password', '')

    if username == '' or password == '':
        data = {
            "status": "error",
            "message": "Username or password cannot be empty"
        }
        return JsonResponse(data)

    item = Compte.objects.filter(login=username)

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

    if not check_password(password, account.mot_de_passe_hash):
        data = {
            "status": "error",
            "message": "Invalid password"
        }
        return JsonResponse(data)

    data = {
        "status": "success",
        "message": "Login successful",
        "id": account.id_compte,
        "role": account.role
    }

    return JsonResponse(data)

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

    prestataire = Prestataire.objects.filter(id_compte=account.id_compte).first()
    if not prestataire:
        data = {
            "status": "error",
            "message": "Prestataire not found"
        }
        return JsonResponse(data)

    services = Service.objects.filter(id_prestataire=prestataire.id_prestataire)
    data = {
        "status": "success",
        "message": "Services retrieved successfully",
        "services": []
    }
    for service in services:
        data["services"].append({
            "id_service": service.id_service,
            "intitule": service.intitule
        })
    return JsonResponse(data)

def getServiceGrades(request, service_id):
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

    prestataire = Prestataire.objects.filter(id_compte=account.id_compte).first()
    if not prestataire:
        data = {
            "status": "error",
            "message": "Prestataire not found"
        }
        return JsonResponse(data)

    service = Service.objects.filter(id_service=service_id).first()
    if not service:
        data = {
            "status": "error",
            "message": "Service not found"
        }
        return JsonResponse(data)

    if not service.id_prestataire == prestataire.id_prestataire:
        data = {
            "status": "error",
            "message": "You are not authorized to access this service"
        }
        return JsonResponse(data)

    data = {
        "status": "success",
        "message": "Service grades retrieved successfully",
        "intitule": service.intitule,
        "notes": []
    }
    notes = Note.objects.filter(id_service=service.id_service)

    for note in notes:
        client = Client.objects.filter(id_client=note.id_client).first()
        data["notes"].append({
            "valeur": note.valeur,
            "commentaire": note.commentaire,
            "nom_client": client.nom,
            "prenom_client": client.prenom
        })
    return JsonResponse(data)

def getAccountPendingValidation(request):
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

    if not account.role == "ADMIN":
        data = {
            "status": "error",
            "message": "Unauthorized"
        }
        return JsonResponse(data)

    data = {
        "status": "success",
        "message": "Successfully querried pending accounts",
        "comptes": []
    }
    accounts = Compte.objects.filter(statut='NONVALIDE')
    for account in accounts:
        if account.role == "PRESTATAIRE":
            prestataire = Prestataire.objects.get(id_compte=account.id_compte)
            data["comptes"].append({
                "id_compte": account.id_compte,
                "nom": prestataire.nom,
                "prenom": prestataire.prenom,
                "email": prestataire.email,
            })
        if account.role == "CLIENT":
            client = Client.objects.get(id_compte=account.id_compte)
            data["comptes"].append({
                "id_compte": account.id_compte,
                "nom": client.nom,
                "prenom": client.prenom,
                "email": client.email,
            })

    return JsonResponse(data)

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