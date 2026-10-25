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

A COMPLETER


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