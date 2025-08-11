const express = require('express');
const connectdb = require('./config/database');

const cors = require('cors');

const statsRoutes = require('./routes/statsRoutes');

const mongoose = require('mongoose');
const app = express();

const clientRoutes = require('./routes/clientRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/servicesRoutes');
const transactionRoutes = require('./routes/transactionsRoutes');

const rateLimit = require('express-rate-limit');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const routesSearch = require('./routes/search');
// Configuration de Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Clients",
      version: "1.0.0",
      description: "Documentation de l'API Clients",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);


// la configuration de CORS pour autoriser les requêtes depuis le frontend
app.use(cors({
  origin: 'http://localhost',  // l'url de mon frontend a la place de localhost
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));
// fonction pour limiter le nombre de requêtes par IP
const limiteFonction = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Trop de requêtes effectuées depuis cette IP, réessayez plus tard.',
  standardHeaders: true,
  legacyHeaders: false, 
  // chaque ip ne peut faire que 100 requêtes toutes les 15 minutes
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/search', routesSearch);
app.use('/api/stats', statsRoutes);
app.use(limiteFonction);
app.use(express.json());
console.log('----------------------------- Serveur les routes !');
app.use('/api/clients', clientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/transactions', transactionRoutes);


// Connexion à la base de données
connectdb();
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
