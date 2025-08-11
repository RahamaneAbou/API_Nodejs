// models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom:         { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  telephone:   { type: String },
  entreprise:  { type: String },
  adresse:     { type: String },
  note:        { type: String },
}, { timestamps: true });
module.exports = mongoose.models['93859310_clients'] || mongoose.model('93859310_clients', clientSchema);

