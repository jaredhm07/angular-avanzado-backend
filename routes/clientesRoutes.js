'use strict'

var express = require('express');
var ClientesController = require('../controllers/clientesController');

var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

router.get('/home', ClientesController.home);
router.post('/test', ClientesController.test);
router.post('/save', ClientesController.saveCliente);
router.get('/cliente/:id?', ClientesController.getClienteById);
router.get('/clientes', ClientesController.getClientes);
router.put('/cliente/:id', ClientesController.updateCliente);
router.delete('/cliente/:id', ClientesController.deleteCliente);
router.post('/upload-image/:id', multipartMiddleware, ClientesController.uploadImage);

module.exports = router;