
# API Documentation

## Description
Cette API permet de gérer les **Clients**, **Services**, **Transactions** et **Utilisateurs**.  
Elle est développée avec **Node.js**, **Express** et **MongoDB**.
Et on Options en plus qui sont **La recherche et les statistique**

---

## Technologies Utilisées
- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express.js** : Framework web minimaliste pour Node.js.
- **MongoDB** : Base de données NoSQL.
- **Mongoose** : ODM (Object Data Modeling) pour MongoDB.
- **dotenv** : Gestion des variables d'environnement.

---

## Installation

1. **Cloner le projet**
```bash
git clone https://github.com/RahamaneAbou/API_Nodejs.git
cd API_Node
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Créer un fichier `.env` à la racine avec :
```
PORT=5000
MONGO_URI=mongodb+srv://azougoulrich:6MGSnixm8eFU5yor@cluster0.fpv9rdu.mongodb.net/evaluation_finale?retryWrites=true&w=majority&appName=Cluster0
```

4. **Démarrer le serveur**
```bash
npm start
```
ou en mode développement :
```bash
npm run dev ou npm run start
```

---

## Routes de l'API

### Clients
- **GET** `/api/clients` → Récupérer tous les clients (pagination disponible)
- **GET** `/api/clients/:id` → Récupérer un client par ID
- **POST** `/api/clients` → Créer un nouveau client
- **PUT** `/api/clients/:id` → Mettre à jour un client
- **DELETE** `/api/clients/:id` → Supprimer un client

### Services
- **GET** `/api/services` → Récupérer tous les services (pagination disponible)
- **GET** `/api/services/:id` → Récupérer un service par ID
- **POST** `/api/services` → Créer un nouveau service
- **PUT** `/api/services/:id` → Mettre à jour un service
- **DELETE** `/api/services/:id` → Supprimer un service

### Transactions
- **GET** `/api/transactions` → Récupérer toutes les transactions (pagination disponible)
- **GET** `/api/transactions/:id` → Récupérer une transaction par ID
- **POST** `/api/transactions` → Créer une nouvelle transaction
- **PUT** `/api/transactions/:id` → Mettre à jour une transaction
- **DELETE** `/api/transactions/:id` → Supprimer une transaction

### Utilisateurs
- **GET** `/api/users` → Récupérer tous les utilisateurs (pagination disponible)
- **GET** `/api/users/:id` → Récupérer un utilisateur par ID
- **POST** `/api/users` → Créer un nouvel utilisateur
- **PUT** `/api/users/:id` → Mettre à jour un utilisateur
- **DELETE** `/api/users/:id` → Supprimer un utilisateur

### Options en plus
- **GET** `/api/stats`→  Fait et affiche les statistique de l'entreprise
- **GET** `/api/search`→  Fait des recherche au seins des different modeles(client, user,services, transactin)
---

## Pagination
Toutes les routes **GET** supportent la pagination via les paramètres :
```
?page=1&limit=10
```
- **page** : Numéro de page (par défaut : 1)
- **limit** : Nombre d'éléments par page (par défaut : 10)

Exemple :
```
GET /api/clients?page=2&limit=5
```

---

## Codes de Réponse
- **200 OK** → Requête réussie
- **201 Created** → Ressource créée avec succès
- **400 Bad Request** → Erreur dans la requête
- **404 Not Found** → Ressource non trouvée
- **500 Internal Server Error** → Erreur interne du serveur

---

## Auteur
Développé par **[ABOU-BAKARI Rahamane]** – 2025

