require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Client = require('../models/client');
const Service = require('../models/services');
const Transaction = require('../models/transaction');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('------------------------------------------ Connecté à MongoDB');

    // 1. Supprimer anciennes données
    await Client.deleteMany({});
    await Service.deleteMany({});
    await Transaction.deleteMany({});
    console.log('------------------------------------------Anciennes données supprimées');

    // 2. Créer clients
    const clients = [];
    for (let i = 0; i < 50; i++) {
      clients.push(await Client.create({
        nom: faker.person.fullName(),
        email: faker.internet.email(),
        telephone: faker.phone.number()
      }));
    }
    console.log('------------------------------------------ 50 clients créés');

    // 3. Créer services
    const services = [];
    for (let i = 0; i < 10; i++) {
      services.push(await Service.create({
        nom: faker.commerce.productName(),
        prix: faker.number.int({ min: 50, max: 500 })
      }));
    }
    console.log('------------------------------------------ 10 services créés');

    // 4. Créer transactions
    for (let i = 0; i < 200; i++) {
      await Transaction.create({
        client: faker.helpers.arrayElement(clients)._id,
        service: faker.helpers.arrayElement(services)._id,
        montant: faker.number.int({ min: 50, max: 500 }),
        date: faker.date.between({ from: '2024-01-01', to: '2025-08-01' })
      });
    }
    console.log('------------------------------------------ 200 transactions créées');

    console.log('------------------------------------------ Base de données peuplée avec succès');
    mongoose.connection.close();
  } catch (error) {
    console.error('------------------------------------------ Erreur lors du peuplement :', error);
    mongoose.connection.close();
  }
}

seedDatabase();
