'use strict'

var ClientesModel = require('../models/clientesModel');
var fs = require('fs');

var controller = {
    home: function(req, res) {
        return res.status(200).send({
            message: 'Home'
        });
    },
    test: function(req, res) {
        return res.status(200).send({
            message: 'test'
        });
    },

    saveCliente: function(req, res) {
        var cliente = new ClientesModel();

        var params = req.body;
        cliente.name = params.name;
        cliente.description = params.description;
        cliente.category = params.category;

        cliente.save((err, clienteStored) => {
            if(err) return res.status(500).send({message: 'Error en la petición'});
            if(!clienteStored) return res.status(404).send({message: 'No se ha guardado el cliente'});

            return res.status(200).send({cliente: clienteStored});
        });
    },

    getClienteById: function(req, res) {
        var clienteId = req.params.id;

        if(clienteId == null) return res.status(404).send({message: 'El cliente no existe'});

        ClientesModel.findById(clienteId, (err, cliente) => {
            if(err) return res.status(500).send({message: 'Error data cliente Id'});
            if(!cliente) return res.status(404).send({message: 'El cliente no existe'});

            return res.status(200).send({cliente});
        });
    },

    getClientes: function(req, res) {
        ClientesModel.find({}).sort('_id').exec((err, clientes) => {
            if(err) return res.status(500).send({message: 'Error get clientes from server'});
            if(clientes == null) return res.status(404).send({message: 'No se encontraron clientes'})

            return res.status(200).send({clientes});
        })
    },

    updateCliente: function(req, res) {
        var clienteId = req.params.id;
        var update = req.body;

        ClientesModel.findByIdAndUpdate(clienteId, update, {new: true}, (err, clienteUpdated) => {
            if(err) return res.status(500).send({message: 'Error al actualizar'});
            if(!clienteUpdated) return res.status(404).send({message: 'No existe el cliente'});

            return res.status(200).send({clienteUpdated});
        })
    },

    deleteCliente: function(req, res) {
        var clienteId = req.params.id;

        ClientesModel.findByIdAndDelete(clienteId, (err, clienteDeleted) => {
            if(err) return res.status(500).send({message: 'Error al borrar'});
            if(!clienteDeleted) return res.status(404).send({message: 'No existe el cliente'});

            return res.status(200).send({clienteDeleted});
        });
    },

    uploadImage: function(req, res) {
        var clienteId = req.params.id;
        var fileName = 'Imagen no subida...';

        if(req.files) {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                ClientesModel.findByIdAndUpdate(clienteId, {image: fileName}, {new: true}, (err, imageUpdated) => {
                    if(err) return res.status(500).send({message: 'Error al actualizar la imagen'});
                    if(!imageUpdated) return res.status(500).send({message: 'La imagen no existe'});
                    return res.status(200).send({
                        files: fileName
                    });
                });
            } else {
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({message: 'La extensión no es válida'});
                });
            }          
    
        } else {
            return res.status(404).send({
                message: fileName
            });
        }
    }

};

module.exports = controller;