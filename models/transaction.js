// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: '93859310_clients', 
    required: true 
  },
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: '93859310_services', 
    required: true 
  },
  montant: { 
    type: Number, 
    required: true 
  },
  statut: { 
    type: String, 
    enum: ['en attente', 'payé', 'annulé'], 
    default: 'en attente' 
  },
  date: { 
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.models['93859310_transactions'] 
  || mongoose.model('93859310_transactions', transactionSchema);
