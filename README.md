# MediSync

MediSync est une application moderne de gestion des rendez-vous et du suivi des patients, spécialement conçue pour les 
infirmières libérales. Elle permet une organisation fluide, une gestion optimisée des consultations et un suivi
efficace des patients.

## Fonctionnalités

- Agenda intelligent : Planification et gestion des rendez-vous avec rappels automatiques.
- Dossier patient : Stockage sécurisé des informations médicales essentielles.
- Notifications : Alertes pour les consultations à venir.
- Gestion administrative : Notes, facturation et suivi.

## Prérequis

Avoir installé au préalable :

- [Volta](https://docs.volta.sh/guide/getting-started) : pour installer et utiliser de manière transparente les bonnes versions de
  NodeJS et NPM.
- [Docker](https://docs.volta.sh/guide/getting-started) : pour avoir accès aux bases de données Postgres, ainsi que l'application containerisé
    - Sur Windows : Passer par la [WSL 2](https://learn.microsoft.com/fr-fr/windows/wsl/install#install-wsl-command) pour installer Docker comme si vous étiez sur Linux
    - Sur Linux (Ex: Ubuntu) : Installez en passant par le [repository APT](https://docs.docker.com/engine/install/ubuntu/#installation-methods).
    - Sur MacOS : Installez en utilisant Brew puis installez aussi "colima" de la même manière `brew install docker colima`
        - Pour que les tests fonctionnent en local, il faudra aussi exporter ces deux variables d'environnement à votre fichier de config ".zshrc" :
            - export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"
            - export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE="/var/run/docker.sock"

## Usage

La majorité des interactions avec le backend passent par les scripts NPM.

Pour découvrir la liste des scripts NPM, exécuter `npm run`.

### Démarrage rapide

- Pour démarrer les bases de données nécessaires au projet, allez dans le dossier deploy `cd deploy` et exécuter `docker compose --profile db up -d`
- Pour démarrer le backend, exécuter `npm start`.
- Pour démarrer le backend en mode développement avec watch, exécuter `npm run dev` :
  ```shell
  ✅ Ran 4 scripts and skipped 0 in 18s.
  INFO (50907): IoC container initialized.
  INFO (50907): Registering plugins
  INFO (50907): All plugins registered
  INFO (50907): Starting a postgresql pool with 21 connections.
  INFO (50907): Server is listening
  INFO (50907): Server is ready: visit http://127.0.0.1:3000/
  ```
- Pour démarrer le backend en mode développement, exécuter `npm run start:development`.
- Pour démarrer le backend en mode production, exécuter `npm run start:production` (prérequis : avoir construit le
  projet).
