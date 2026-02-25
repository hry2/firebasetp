# 🛡️ AntiPhishLab — Projet Final  
### Docker • GitHub • Firebase Hosting • Google Cloud Run • CI/CD

---

## 📌 Présentation

**AntiPhishLab** est une plateforme pédagogique interactive de sensibilisation au phishing.  
Sa version actuelle permet de :

- Simuler des emails frauduleux en conditions réalistes
- Tester ses connaissances via un mini-quiz
- Comprendre les signaux d’alerte (urgence, domaine suspect, incohérences)

---

## 🎯 Objectif du TP

Ce projet répond aux exigences suivantes :

- Versionning Git + GitHub
- Dockerisation complète pour tests dev en local (web + API)
- Déploiements dans le Cloud (prod) :
  - 🔵 Firebase Hosting (Front React)
  - 🟢 Google Cloud Run (API conteneurisée)
- Automatisation complète CI/CD via GitHub Actions
-  Déploiement automatique au push sur `main`

---

## Architecture du repo

```
.
├── .github/workflows/deploy.yml
├── app/                # code Frontend (Vite + React)
├── api/                # Backend 
├── Dockerfile.web
├── Dockerfile.api
├── docker-compose.yml
├── firebase.json
└── README.md
```

---

## 1️. Développement & Test en Local

### 🔧 Prérequis

- Installer Docker / Docker Desktop /Docker compose
- Installer Git
- Cloner le dépôt en local à l'aide de la commande suivante :
git clone https://github.com/hry2/firebasetp.git



### 1.1. Lancement complet en local  avec docker 

```bash
docker compose up --build
```

### 🔎 Accès :

- Front : http://localhost:8080
- API : http://localhost:3000/api/health



### 1.2. Arrêter l'environnement local

```bash
docker compose down
```

### 1.3. Purger l'environnement (si besoin de tout clean)

```bash
docker system prune -f
```

---

## 2. Explication de la logique des deploiements (optionnel)
**Vous pouvez aller à l'étape 3 pour embrayer sur l'automatisation. En effet cette section sera full explication**  
L'automatisation mise en oeuvre consiste tout simplement à "fourir les environnements nécessaires" pour exécuter des commandes pour exposer en ligne le front end et l'api.
### 🔧 Prérequis environnement frontend

- Compte google + projet Firebase créé
- Firebase CLI installé
- Avoir activé Hosting dans Firebase
- Adapter le repo (il doit contenir l'app buildé) et le fichier firebase.json pour exposer l'app 


### 2.1. Commandes de déploiement firebase pour le frontend
Dans un environnement (qui a les prérequis précédents) on lance les commandes
```bash
firebase login
firebase deploy --only hosting --project <nom du projet>
```

### 🔧 Prérequis environnement api (backend)

- Un projet Google Cloud Platform (GCP)
- Facturation activée sur le projet
- Google Cloud SDK installé
- Adapter son repo (cloner ce repo fonctionnera)

### 2.2. Commandes de déploiement backend
Exposition de l'api via conteneur 
```bash
gcloud version
gcloud auth login
gcloud config set project <PROJECT_ID>
gcloud services enable artifactregistry.googleapis.com run.googleapis.com
gcloud artifacts repositories create antiphish \
  --repository-format=docker \
  --location=europe-west1 \
  --description="AntiPhish Docker images"
gcloud auth configure-docker europe-west1-docker.pkg.dev

docker build -f Dockerfile.api \
  -t europe-west1-docker.pkg.dev/webapp-98670/antiphish/api:latest .

docker push europe-west1-docker.pkg.dev/webapp-98670/antiphish/api:latest

gcloud run deploy antiphish-api \
  --image europe-west1-docker.pkg.dev/webapp-98670/antiphish/api:latest \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000
```



### 🔎 Accès
Regarder dans les logs du run les endpoints à tester 
```bash
curl https://antiphish-api-xxxxx.run.app/api/health
curl https://antiphish-api-xxxxx.run.app/api/scenarios
curl https://antiphish-api-xxxxx.run.app/api/quiz
```

---

## 3. Automatisation CI/CD (GitHub Actions) ⚙️

### 3.1. Principe

Push code sur `main` ➜

1. Build React
2. Deploy Firebase
3. Build image API
4. Push Artifact Registry
5. Deploy Cloud Run



### 3.2. Secrets GitHub requis

Dans `Settings → Secrets → Actions` :

- `FIREBASE_TOKEN`(répurer grâce à firebase cli)
```bash
firebase login:ci
```
- `GCP_SA_KEY` (clé JSON du service account)  

Rôles nécessaires pour le service account :

-- Artifact Registry Writer
-- Cloud Run Admin
-- Service Account User


### 3.3. Workflow automatique

Assurez vous que le `.github/workflows/deploy` soit bien présent dans le repo.  
Il faut aussi vérifier qu'il se repère correctement à vos secrets (leur nom dans github). Si ces conditions sont remplies, il vous suffit de committer votre code puis push :

```bash
git commit -m "Infos et ref changements à commit"
git push origin main
```
Chaque `git push` sur `main` déclenche :

- Déploiement Firebase Hosting
- Déploiement Cloud Run
- Mise à jour automatique production

**Il faut donc correctement tester le code via l'env dev avant tout push sur main.**


## 📊 Endpoints API

| Route | Description |
|--------|------------|
| `/` | Health message |
| `/api/health` | Vérification service |
| `/api/scenarios` | Liste scénarios |
| `/api/quiz` | Quiz |
| `/api/score` | Envoi score |


---


## 👨‍💻 Auteur

**Harry AKPABIE**  

Docker • Cloud • DevOps • Cybersécurité