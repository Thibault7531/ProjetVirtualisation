# Instructions pour l'installation dans des machines virtuelles

## Prérequis

- VirtualBox
- 3 machines virtuelles avec Ubuntu Server.
- 1 machine possède une carte réseau NAT et interne.
- 2 machines possèdent une carte réseau interne.

## Configuration réseau

Sur les 3 machines:
- Identifier le nom de la carte réseau interne avec la commande 'ip a'
- Modifier le fichier [01-netcfg.yaml](ConfigVM/01-netcfg.yaml) en mettant l'adresse IP de la machine sur le réseau interne et le nom de la carte réseau interne.
- Copier ce fichier dans le dossier /etc/netplan/ sur les 3 machines.
- 'sudo netplan apply'

## Configuration de la base de données

- Installer mariadb-server depuis le dépôt officiel 'sudo apt install mariadb-server'
- Initialiser la base de données 'sudo mysql_secure_installation'
- Créer un utilisateur et une base de données 'sudo mysql -u root -p'
- Lancer le service 'sudo systemctl start mariadb'
- Activer le service 'sudo systemctl enable mariadb'
- Cloner ce dépôt git 'git clone https://github.com/Thibault7531/ProjetVirtualisation.git /path/to/repo'
- Executer le script sql [user.sql](donnees/users.sql) en le modifiant pour mettre votre utilisateur, mot de passe et IP de la machine métier: 'mariadb -u root < /path/to/script.sql'
- Executer le script sql [schema.sql](donnees/schema.sql).
- Executer le script sql [data.sql](donnees/data.sql) pour obtenir un remplissage de la base de données à titre d'exemple.
- Modifier la configuration de mariadb (/etc/mysql/mariadb.conf.d/50-server.cnf) et ajouter 'bind-address = 0.0.0.0' sous '[mysqld]'
- Redémarrer le service mariadb 'sudo systemctl restart mariadb'

## Configuration de la couche métier

- Installer python3 'sudo apt install python3'
- Créer un environement virtuel 'python3 -m venv /path/to/env'
- /path/to/env/bin/pip install django mysqlclient gunicorn
- Create .env file to define the DB_HOST, DB_USER, DB_PASSWORD environment variables the access to the database.
- Cloner ce dépôt git 'git clone https://github.com/Thibault7531/ProjetVirtualisation.git /path/to/repo'
- Executer 'DB_HOST=ipbasededonnees /path/to/env/bin/python /path/to/repo/client/manage.py migrate'
- Modifier la configuration du service gunicorn [gunicorn.service](ConfigVM/gunicorn.service) en mettant le chemin du venv et du dépot.
- Mettre ce fichier dans le dossier /etc/systemd/system/
- Mettre à jour les services 'sudo systemctl daemon-reload'
- Démarrer le service gunicorn 'sudo systemctl start gunicorn'
- Activer le service gunicorn 'sudo systemctl enable gunicorn'

## Configuration de la machine client

- Installer nginx 'sudo apt install nginx'
- Cloner ce dépôt git 'git clone https://github.com/Thibault7531/ProjetVirtualisation.git /path/to/repo'
- Modifier la configuration de nginx [metier](ConfigVM/metier) en mettant les chemins du dépot.
- Mettre ce fichier dans le dossier /etc/nginx/sites-available/
- Créer un lien symbolique vers le fichier de configuration 'sudo ln -s /etc/nginx/sites-available/metier /etc/nginx/sites-enabled/'
- Mettre à jour les services 'sudo systemctl daemon-reload'
- Démarrer le service nginx 'sudo systemctl start nginx'
- Activer le service nginx 'sudo systemctl enable nginx'