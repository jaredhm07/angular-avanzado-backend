'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientesSchema = Schema({
    name: String,
    description: String,
    category: String
});

module.exports = mongoose.model('Cliente', ClientesSchema);
// clientes -->  guarda los documentos en la colección MongoDB(lo convierte a minúsculas y a plural)