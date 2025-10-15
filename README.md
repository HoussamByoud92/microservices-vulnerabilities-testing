# 🔓 Microservices Vulnérables - Démo Éducative

⚠️ **REMARQUE**: Ce mini projet est **intentionnellement vulnérable** à des fins éducatives.

## 🎯 Objectif

Démontrer les vulnérabilités courantes dans les architectures microservices:
- ❌ Absence d'authentification
- ❌ Absence de validation des entrées
- ❌ Exposition de données sensibles (SSN, salaires, mots de passe)
- ❌ Logs contenant des informations confidentielles
- ❌ Absence d'autorisation
- ❌ Pas de chiffrement des données

## 🏗️ Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Frontend/Gateway                      │
│                   http://localhost:3000                  │
└────────────┬────────────┬────────────┬──────────────────┘
             │            │            │            │
    ┌────────▼───┐  ┌────▼─────┐  ┌──▼──────┐  ┌─▼────────────┐
    │   Auth     │  │ Employee │  │ Payroll │  │ Notification │
    │  Service   │  │ Service  │  │ Service │  │   Service    │
    │   :3001    │  │  :3002   │  │  :3003  │  │    :3004     │
    └────────────┘  └──────────┘  └─────────┘  └──────────────┘
\`\`\`

## 🚀 Démarrage Rapide

### Prérequis
- Docker et Docker Compose installés
- Ports 3000-3004 disponibles

### Lancer l'application

\`\`\`bash
# Construire et démarrer tous les services
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d --build
\`\`\`

### Accéder à l'application

- **Frontend Dashboard**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Employee Service**: http://localhost:3002
- **Payroll Service**: http://localhost:3003
- **Notification Service**: http://localhost:3004

### Arrêter l'application

\`\`\`bash
docker-compose down
\`\`\`

## 📋 Services et Endpoints

### 🔓 Auth Service (Port 3001)

**Vulnérabilités**: Mots de passe en clair, pas de tokens, exposition des SSN

\`\`\`bash
# Lister tous les utilisateurs (avec mots de passe!)
curl http://localhost:3001/users

# Login (retourne le mot de passe!)
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Créer un utilisateur (sans validation)
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","password":"123","role":"admin","ssn":"000-00-0000"}'

# Obtenir un utilisateur spécifique
curl http://localhost:3001/users/1

# Supprimer un utilisateur (sans autorisation!)
curl -X DELETE http://localhost:3001/users/2
\`\`\`

### 👥 Employee Service (Port 3002)

**Vulnérabilités**: Exposition des PII (SSN, adresses, dates de naissance)

\`\`\`bash
# Lister tous les employés (avec SSN et adresses!)
curl http://localhost:3002/employees

# Obtenir un employé spécifique
curl http://localhost:3002/employees/1

# Créer un employé (sans validation)
curl -X POST http://localhost:3002/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Alice",
    "lastName":"Hacker",
    "email":"alice@evil.com",
    "ssn":"999-99-9999",
    "dateOfBirth":"1995-01-01",
    "address":"123 Evil St",
    "phone":"555-HACK",
    "department":"IT",
    "position":"Pentester"
  }'

# Modifier un employé (sans autorisation)
curl -X PUT http://localhost:3002/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"salary":999999}'

# Supprimer un employé
curl -X DELETE http://localhost:3002/employees/3
\`\`\`

### 💰 Payroll Service (Port 3003)

**Vulnérabilités**: Exposition des salaires, comptes bancaires, modification sans autorisation

\`\`\`bash
# Lister tous les salaires (avec comptes bancaires!)
curl http://localhost:3003/payroll

# Obtenir le salaire d'un employé
curl http://localhost:3003/payroll/1

# AJUSTER UN SALAIRE (sans autorisation!)
curl -X POST http://localhost:3003/payroll/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":1,
    "newSalary":250000,
    "reason":"Self-promotion"
  }'

# AJOUTER UN BONUS (sans autorisation!)
curl -X POST http://localhost:3003/payroll/bonus \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":1,
    "bonusAmount":50000
  }'

# Obtenir les informations bancaires
curl http://localhost:3003/payroll/banking/1
\`\`\`

### 📧 Notification Service (Port 3004)

**Vulnérabilités**: Logs contenant des données sensibles, accès non restreint

\`\`\`bash
# Lister toutes les notifications
curl http://localhost:3004/notifications

# Envoyer une notification (avec données sensibles)
curl -X POST http://localhost:3004/notify \
  -H "Content-Type: application/json" \
  -d '{
    "recipient":"victim@company.com",
    "subject":"Your salary has been adjusted",
    "message":"Congratulations!",
    "sensitiveData":{"ssn":"123-45-6789","newSalary":1000000}
  }'

# Envoyer une notification de paie
curl -X POST http://localhost:3004/notify/payroll \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":1,
    "employeeName":"John Doe",
    "salary":95000,
    "ssn":"987-65-4321",
    "email":"john.doe@company.com"
  }'

# Obtenir une notification spécifique
curl http://localhost:3004/notifications/1
\`\`\`

## 🧪 Scénarios de Test

### Tester Automatiquement Tous les Endpoints

#### Option 1: Script Node.js (Recommandé)

\`\`\`bash
# Installer les dépendances (node-fetch est déjà inclus)
npm install

# Lancer tous les tests
node test-all-endpoints.js
\`\`\`

Ce script teste automatiquement:
- ✅ Tous les endpoints de tous les services
- ✅ Vérifie les codes de statut HTTP
- ✅ Affiche un rapport détaillé avec couleurs
- ✅ Retourne un code d'erreur si des tests échouent

#### Option 2: Script Bash avec curl

\`\`\`bash
# Rendre le script exécutable
chmod +x test-endpoints.sh

# Lancer tous les tests
./test-endpoints.sh
\`\`\`

#### Option 3: Collection Postman

Importez `postman-collection.json` dans Postman et utilisez le "Collection Runner" pour exécuter tous les tests automatiquement.

### Scénarios d'Attaque Manuels

### Scénario 1: Vol de données PII
\`\`\`bash
# Un attaquant peut facilement récupérer tous les SSN
curl http://localhost:3002/employees | grep -o '"ssn":"[^"]*"'
\`\`\`

### Scénario 2: Augmentation de salaire non autorisée
\`\`\`bash
# N'importe qui peut augmenter son propre salaire!
curl -X POST http://localhost:3003/payroll/adjust \
  -H "Content-Type: application/json" \
  -d '{"employeeId":1,"newSalary":999999,"reason":"I deserve it"}'
\`\`\`

### Scénario 3: Accès aux comptes bancaires
\`\`\`bash
# Récupérer tous les comptes bancaires
curl http://localhost:3003/payroll | grep -o '"bankAccount":"[^"]*"'
\`\`\`

### Scénario 4: Création d'admin malveillant
\`\`\`bash
# Créer un compte admin sans vérification
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"username":"backdoor","password":"secret","role":"admin"}'
\`\`\`

## 📊 Données de Test

### Utilisateurs (Auth Service)
- **admin** / admin123 (role: admin, SSN: 123-45-6789)
- **john.doe** / password (role: employee, SSN: 987-65-4321)
- **jane.smith** / 12345 (role: manager, SSN: 555-12-3456)

### Employés (Employee Service)
1. John Doe - SSN: 987-65-4321, Engineering
2. Jane Smith - SSN: 555-12-3456, HR Manager
3. Bob Johnson - SSN: 111-22-3333, Finance

### Salaires (Payroll Service)
1. John Doe - $95,000 + $10,000 bonus
2. Jane Smith - $85,000 + $8,000 bonus
3. Bob Johnson - $75,000 + $5,000 bonus

## 🔍 Observer les Logs

Les logs montrent toutes les données sensibles en clair:

\`\`\`bash
# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f payroll-service
docker-compose logs -f auth-service
\`\`\`

## 🛠️ Développement

### Structure du projet
\`\`\`
.
├── docker-compose.yml
├── README.md
├── postman-collection.json
├── auth-service/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── employee-service/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── payroll-service/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── notification-service/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── server.js
\`\`\`

### Modifier un service

1. Éditer le fichier `server.js` du service
2. Reconstruire: `docker-compose up --build <service-name>`

## 📝 Collection Postman

Importez le fichier `postman-collection.json` dans Postman pour tester tous les endpoints facilement.

## ⚠️ Vulnérabilités Démontrées

1. **Absence d'authentification**: Tous les endpoints sont accessibles sans token
2. **Absence d'autorisation**: N'importe qui peut modifier les salaires
3. **Exposition de PII**: SSN, adresses, dates de naissance accessibles
4. **Mots de passe en clair**: Stockés et retournés sans hachage
5. **Logs verbeux**: Données sensibles dans les logs
6. **Pas de validation**: Injection possible, pas de sanitization
7. **Pas de rate limiting**: Attaques par force brute possibles
8. **Données bancaires exposées**: Comptes et routing numbers accessibles
9. **CORS ouvert**: Pas de restriction d'origine
10. **Pas de chiffrement**: Toutes les communications en HTTP

## 🎓 Utilisation Pédagogique

Ce projet peut être utilisé pour:
- Démonstrations de sécurité
- Ateliers de pentesting
- Formation DevSecOps
- Cours sur les microservices sécurisés
- Exercices de remédiation

## 📚 Ressources

Pour sécuriser ces services, il faudrait:
- Implémenter JWT ou OAuth2
- Ajouter des middlewares d'autorisation
- Chiffrer les données sensibles
- Utiliser HTTPS
- Implémenter rate limiting
- Valider et sanitizer toutes les entrées
- Masquer les données dans les logs
- Utiliser des secrets managers
- Implémenter RBAC (Role-Based Access Control)

<img width="1633" height="917" alt="image" src="https://github.com/user-attachments/assets/40024e3d-24b6-4d63-a863-9549506a5326" />
<img width="1564" height="432" alt="image" src="https://github.com/user-attachments/assets/ed0cddca-aa51-4041-8142-f5e1ee962a97" />

