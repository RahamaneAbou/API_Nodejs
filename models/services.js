// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  nom:        { type: String, required: true },
  description:{ type: String },
  prix:       { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.models['93859310_services'] || mongoose.model('93859310_services', serviceSchema);
