# Rapport - Virtualisation et conteneurisation

## Conception de l'application

Pour ce projet, nous avons décidé de créer une application web permettant à des prestataires d'obtenir des avis sur leurs services.
Lorsqu'un prestataire se connecte à l'application, il peut obtenir la liste des avis et des notes qu'il a reçus pour chacun des services qu'il propose.
Lorsqu'un client se connecte, il a accès à tout les services proposés par les prestataires de la plateforme et peut laisser une note avec un commentaire.
Les admininstrateurs peuvent quant à eux accéder à la liste des prestataires et des clients, ainsi que la liste des nouveaux inscrits pour valider ou refuser leur inscription.

Architecture:
- Base de données (MariaDB): Gère le stockage de toutes les données de l'application. Le schéma des différentes tables se trouve dans le fichier [schema.sql](donnees/schema.sql).
- Couche métier (Django): Gère l'accès aux données, les permissions d'accès et la logique de l'application.
- Couche client/proxy (HTML/CSS/JS et Nginx): Gère l'interface utilisateur et la communication avec les différentes machines du serveur.

Pour le prototype de l'application, il a été choisi de faire un interface web simple qui n'affiche que les données nécessaires pour ne pas surcharger l'utilisateur.
Le prototype possède les pages suivantes:
- Connexion: Permet de se connecter à l'application.
- Inscription: Permet de s'inscrire à l'application.
- Espace client: Permet de consulter les services proposés par les prestataires et de laisser des avis.
- Espace prestataire: Permet de consulter la liste des services proposés et d'accéder à la page des avis.
- Avis du service: Permet de consulter les avis et les notes qu'un prestataire a reçus pour chacun des services qu'il propose.
- Espace administrateur: Permet de consulter la liste des prestataires et des clients, ainsi que la liste des nouveaux inscrits pour valider ou refuser leur inscription.

Le prototype réalisé sur Figma se trouve à l'adresse: [Prototype Figma](https://www.figma.com/design/h1MC7eokv5YY7pPWgd4iiz/Virtualisation--Copy-?node-id=0-1&t=6UBXYf31MVZTnxOB-1)


## Virtualisation

Pour déployer l'application, nous avons utilisé trois machines virtuelles sur VirtualBox:
- Machine 1: Base de données MariaDB (2 coeur CPU, 2 Go de RAM)
- Machine 2: Serveur Django (2 coeur CPU, 2 Go de RAM)
- Machine 3: Serveur Nginx (1 coeur CPU, 1 Go de RAM)

Les trois machines utilisent comme système d'exploitation Ubuntu Server 26.04 LTS. Le choix de ce système d'exploitation a été motivé par la stabilité ainsi que la richesse du système de packets apt.
L'entièreté des services nécessaires pour déployer l'application sont disponibles directement avec une seule commande et les ressources et guides se reposent souvent sur l'utilisation d'Ubuntu.
Les trois machines virtuelles sont connectées sur un réseau privé interne permettant d'isoler les couches métier et base de données des clients. L'accès à l'application se fait à travers l'interface NAT de la machine Nginx.
Cependant, pour simplifier la configuration des machines virtuelles, une interface NAT était installée sur l'ensemble des machines afin d'y accéder par ssh. Cela permet d'accéder à la machine directement depuis l'invite de commande de l'hôte plutôt que de se connecter par l'écran virtuel de VirtualBox.

L'entièreté des instructions pour déployer l'application dans des machines virtuelles sont disponibles dans le fichier [VM.md](./VM.md)

La configuration des machines virtuelles est un processus qui demande beaucoup de temps car il faut installer le système d'exploitation sur chaque machine virtuelle, installer les packets nécessaires et configurer les services nécessaires pour que l'application fonctionne correctement.
De plus, dupliquer les machines virtuelles pour augmenter les capacités de l'application est aussi un processus qui peut prendre du temps. Dupliquer le disque dur virtuel n'est pas suffisant car il faudra reconfigurer certains services pour permettre la coexistance des différentes machines sur le même réseau.


## Conteneurisation

### Principe

Une machine virtuelle embarque un système d'exploitation complet avec son propre noyau, ce qui explique le temps d'installation et la quantité de ressources qu'elle réserve. Un conteneur, lui, partage le noyau de la machine hôte et n'embarque que l'application et ses dépendances. Il est donc plus léger, plus rapide à démarrer et ne réserve pas de ressources fixes à l'avance.

Nous avons conservé l'architecture en trois couches du déploiement en machines virtuelles. Chaque machine virtuelle est remplacée par un conteneur, et l'ensemble est décrit dans un unique fichier [docker-compose.yml](docker/docker-compose.yml) géré par Docker Compose.

| Couche | Machine virtuelle | Conteneur | Image utilisée |
|--------|-------------------|-----------|----------------|
| Base de données | Machine 1 (Ubuntu + MariaDB) | `db` | `mariadb:11` (image officielle) |
| Métier | Machine 2 (Ubuntu + Python + gunicorn) | `metier` | construite à partir de `python:3.13-slim` |
| Client / proxy | Machine 3 (Ubuntu + Nginx) | `client` | `nginx:stable` (image officielle) |

### Construction de l'image de la couche métier

Les couches base de données et proxy utilisent directement des images officielles : seule leur configuration est fournie. La couche métier, elle, est construite à partir du [Dockerfile](metier/Dockerfile), qui reprend les étapes de la configuration manuelle de la machine 2 :

1. partir d'une image Python légère (`python:3.13-slim`) ;
2. installer les bibliothèques système nécessaires à la compilation du connecteur `mysqlclient` ;
3. installer les dépendances Python listées dans `requirements.txt` (Django, mysqlclient, gunicorn) ;
4. copier le code de l'application ;
5. au démarrage, appliquer les migrations Django puis lancer gunicorn avec 3 workers sur le port 8000, comme dans l'ancien service `systemd`.

L'environnement virtuel Python et le fichier `gunicorn.service` ne sont plus nécessaires : le conteneur constitue déjà un environnement isolé et Docker se charge de relancer le service en cas d'arrêt (`restart: unless-stopped`).

### Orchestration avec Docker Compose

Le fichier `docker-compose.yml` remplace à lui seul la configuration réseau et l'installation des trois machines :

- **Réseau** : Docker crée un réseau privé dans lequel les conteneurs se trouvent par leur nom. Django se connecte à la base avec `DB_HOST=db` et Nginx redirige `/api/` vers `http://metier:8000` (voir [nginx.conf](ConfigDocker/nginx.conf)). Les adresses IP fixes `10.10.10.x` disparaissent.
- **Isolation** : seul le conteneur `client` publie un port (80) vers l'extérieur. La base de données et la couche métier ne sont joignables que depuis les autres conteneurs, ce qui reproduit l'isolation obtenue avec le réseau interne de VirtualBox, sans avoir besoin d'une seconde interface NAT pour l'administration.
- **Persistance** : les données de MariaDB sont stockées dans un volume Docker (`db_data`). Elles sont conservées lorsque les conteneurs sont supprimés ou recréés.
- **Initialisation de la base** : les scripts [schema.sql](donnees/schema.sql) et [data.sql](donnees/data.sql) sont montés dans le répertoire d'initialisation de l'image MariaDB. Ils sont exécutés automatiquement et dans le bon ordre au premier démarrage. La création de l'utilisateur est faite par l'image elle-même à partir de variables d'environnement, et cet utilisateur n'a de droits que sur la base `ProjetVirt` (le script `users.sql` donnait tous les droits sur l'ensemble du serveur).
- **Ordre de démarrage** : le conteneur `metier` attend que la base soit réellement prête (vérification de santé avec `depends_on`) avant de se lancer, ce qui évite les erreurs de connexion au démarrage.
- **Secrets** : les mots de passe sont lus depuis un fichier `.env` qui n'est pas versionné.

### Déploiement

Là où le déploiement par machines virtuelles demandait d'installer trois systèmes, de configurer le réseau et de suivre une longue procédure, l'application complète se lance désormais avec une seule commande :

```
cp env.example .env
docker compose up --build
```

L'application est alors accessible sur le port 80 de la machine hôte. L'arrêt se fait avec `docker compose down` (les données sont conservées) et un retour à l'état initial avec `docker compose down -v`.

### Apports et limites

Par rapport aux machines virtuelles, la conteneurisation apporte :

- une **reproductibilité** : la configuration est écrite dans des fichiers versionnés avec le code, et l'environnement est identique sur toutes les machines ;
- une **mise en place rapide** : plus d'installation d'un système d'exploitation, ni de configuration manuelle de chaque service ;
- une **consommation de ressources réduite** : les tests de performance montrent une mémoire utilisée environ 2,5 fois plus faible pour la base de données (125 Mo contre 310 Mo) et plus de dix fois plus faible pour le proxy (17 Mo contre 200 Mo) ;
- une **duplication facilitée** : lancer plusieurs instances d'une couche ne demande plus de cloner un disque et de reconfigurer le réseau.

Plusieurs limites restent à prendre en compte :

- les conteneurs partagent le noyau de l'hôte : l'isolation est moins forte qu'avec des machines virtuelles ;
- aucune limite de ressources n'est fixée dans notre configuration, un conteneur peut donc consommer autant de CPU que l'hôte le lui permet (voir les résultats de la couche métier) ;
- la migration de la base est lancée au démarrage du conteneur métier, ce qui poserait problème si plusieurs instances démarraient en même temps ;
- le paramétrage de Django n'est pas adapté à la production (`DEBUG = True`, clé secrète dans le code, `ALLOWED_HOSTS` restreint).


## Tests de performance

Pour tester les performances de l'application en charge, nous allons utiliser un script JMeter qui va générer des requêtes HTTP vers l'application pour mesurer le temps de latence, le nombre de requêtes par seconde et le taux d'erreur.
Pour permettre en même temps de mesurer les métriques d'utilisation du CPU, de la mémoire et du disque dur, nous avons utilisé un script qui effectue une seule charge durant 30 secondes. Pendant les 10 premières secondes, le scripts augmente petit à petit le nombre de clients connecté sur l'application puis pendant les 20 secondes restantes effectue les requêtes pour un nombre de clients configurable lors de l'éxécution du script.
Lors des tests de performance, seul une instance de l'application est lancée avec une base de données remplie par un [script standard](donnees/data.sql).

Pour chaque test effectué, une page html présentant les résultats détaillés se trouve dans le dossier [JMeter](JMeter).

### Résultats

#### Machine virtuelles

| Charge | Débit (Transactions/seconde) | Latence médiane (ms) | Latence 90e centile (ms) | Latence 95e centile (ms) | Latence 99e centile (ms) | Taux d'erreur | CPU BDD (% sur 1 coeur) | CPU Metier (% sur 1 coeur) | CPU Proxy (% sur 1 coeur)           | RAM BDD | RAM Metier | RAM Proxy | I/O BDD |
|--------|------------------------------|----------------------|--------------------------|--------------------------|--------------------------|---------------|-------------------------|----------------------------|-------------------------------------|---------|------------|-----------|---------|
| 10     | 83,44                        | 141                  | 592                      | 698                      | 969                      | 0%            | 14%                     | 200%                       | 5%                                  | 310Mo   | 330 Mo     | 200Mo     | 24Ko/s  |
| 50     | 79,11                        | 1228                 | 2319                     | 2516                     | 2759                     | 0%            | 12%                     | 200%                       | 5%                                  | 302Mo   | 357Mo      | 200Mo     | 24Ko/s  |
| 100    | 80,23                        | 2360                 | 4346                     | 5200                     | 5780                     | 0%            | 12%                     | 200%                       | 5%                                  | 305Mo   | 360Mo      | 203Mo     | 24Ko/s  |
| 200    | 71,35                        | 3357                 | 10096                    | 11314                    | 14017                    | 0%            | 12%                     | 200%                       | 5%                                  | 305Mo   | 365Mo      | 195Mo     | 24Ko/s  |
| 500    | 4773,26                      | 2                    | 4                        | 5                        | 1029                     | 99,45%        | 12%                     | 200%                       | 2% (pic à 100% au début du plateau) | 302Mo   | 365Mo      | 195Mo     | 24Ko/s  |

On constate que la machine virtuelle métier est surchargée dès 10 utilisateurs connectés et que cette machine est le maillon faible de l'application car elle est la seule à être utilisée à 100%.
Cependant, toutes les requêtes sont traitées par la machine jusqu'à 200 utilisateurs avec comme coût un temps de latence élevé.
Lors du test à 500 utilisateurs, l'application est surchargée et ne peut plus traiter les requêtes. Un pic à 100% a eu lieu sur la machine gérant le proxy puis toutes les requêtes sont bloquées.
Pour améliorer les performances de l'application, il faudrait augmenter la capacité de la machine virtuelle métier ou utiliser plusieurs machines virtuelles métier pour distribuer le traitement des requêtes.


#### Conteneurs

| Charge | Débit (Transactions/seconde) | Latence médiane (ms) | Latence 90e centile (ms) | Latence 95e centile (ms) | Latence 99e centile (ms) | Taux d'erreur | CPU BDD (% sur 1 coeur) | CPU Metier (% sur 1 coeur) | CPU Proxy (% sur 1 coeur) | RAM BDD | RAM Metier | RAM Proxy |
|--------|------------------------------|----------------------|--------------------------|--------------------------|--------------------------|---------------|-------------------------|----------------------------|---------------------------|---------|------------|-----------|
| 10     | 164,49                       | 23                   | 372                      | 389                      | 557                      | 0%            | 3%                      | 285%                       | 1,3%                      | 125Mo   | 123Mo      | 17Mo      |
| 50     | 158,40                       | 606                  | 1199                     | 1252                     | 1406                     | 0%            | 3%                      | 285%                       | 1,15%                     | 125Mo   | 132Mo      | 17Mo      |
| 100    | 162,28                       | 1201                 | 2368                     | 2544                     | 2724                     | 0%            | 3,5%                    | 285%                       | 1,22%                     | 125Mo   | 134Mo      | 18,5Mo    |
| 200    | 140,70                       | 2353                 | 4933                     | 5817                     | 6562                     | 0%            | 2,8%                    | 285%                       | 1,5%                      | 126Mo   | 135Mo      | 20,5Mo    |
| 500    | 79,57                        | 7271                 | 15324                    | 19163                    | 22064                    | 0%            | 2%                      | 285%                       | 1,5%                      | 126Mo   | 135Mo      | 25Mo      |

On constate que pour les conteneurs, la situation est similaire même si le temps de latence est moins élevé que pour les machines virtuelles. Les conteneurs ne disposent pas d'une quantité de ressources virtuelles fixes. La couche métier qui utilisait 100% de son processeur virtuel dans une VM, utilise ici jusqu'à 3 coeurs.
Cependant, on voit que la couche métier reste le maillon faible de l'application car c'est la seule à utiliser une part conséquente du processeur. Il se pourrait qu'ici, en plus d'avoir une contrainte sur les resources disponibles au conteneur, on a une contrainte de la technologie utilisée.
Malgré l'utilisation d'un framework ayant des librairies compilés, l'usage de Python, qui est un langage interprété, pourrait être un facteur de limitation. Si, dans le futur, on veut être capable d'acceuillir plus de trafic, l'usage d'un framework et d'un language compilé pour la couche métier pourrait une piste à privilégier plutôt que de multiplier le nombre de conteneurs pour cette couche de l'application.


## Conclusion

Ce projet nous a permis de déployer une même application web à trois couches (MariaDB, Django, Nginx) de deux manières différentes : avec des machines virtuelles, puis avec des conteneurs Docker.

Le déploiement par machines virtuelles offre une isolation forte, chaque couche disposant de son propre système et de ressources réservées. En contrepartie, la mise en place est longue et manuelle, la configuration est difficile à reproduire et la duplication d'une machine demande de reconfigurer plusieurs services. À l'inverse, la conteneurisation décrit toute l'infrastructure dans quelques fichiers et permet de lancer l'ensemble de l'application avec une seule commande.

Les tests de performance confirment l'intérêt des conteneurs dans notre cas. Le débit est environ deux fois plus élevé (164 transactions par seconde contre 83 pour 10 utilisateurs), les latences sont plus faibles et la mémoire utilisée est nettement réduite. À 500 utilisateurs, l'application en machines virtuelles n'était plus capable de répondre (99,45 % d'erreurs), alors que la version conteneurisée traitait toutes les requêtes, au prix d'une latence élevée. Ces résultats sont toutefois à nuancer : la machine virtuelle métier était limitée à deux cœurs, alors que le conteneur n'avait pas de limite et a utilisé jusqu'à trois cœurs. Une partie de l'écart provient donc de la différence de ressources disponibles et pas uniquement de la technologie.

Dans les deux cas, le même constat apparaît : la couche métier est le maillon faible de l'application. Elle sature le processeur dès les plus faibles charges, tandis que la base de données et le proxy restent très peu sollicités. Plusieurs pistes d'amélioration sont envisageables :

- lancer plusieurs instances du conteneur métier derrière un répartiteur de charge (ce que Docker permet facilement) ;
- ajuster le nombre de workers de gunicorn en fonction du nombre de cœurs disponibles ;
- à plus long terme, utiliser un framework et un langage compilé pour la couche métier ;
- préparer une configuration adaptée à la production (désactivation du mode debug, gestion des secrets, limites de ressources par conteneur).

En conclusion, les machines virtuelles restent pertinentes lorsque l'on a besoin d'une isolation forte ou de systèmes d'exploitation différents, mais pour une application web de ce type, les conteneurs sont plus simples à déployer, plus économes en ressources et plus faciles à faire évoluer.
