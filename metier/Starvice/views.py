import time
from random import randint

from django.http import HttpResponse
from django.http.response import HttpResponseForbidden, JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from .models import Compte, Prestataire, Client

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

    if account.statut == 'NotValidated':
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
    Compte.objects.create(id_compte=id, login=login, mot_de_passe_hash=passwordHash, role=role, statut="NotValidated")
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
