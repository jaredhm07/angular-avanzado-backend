'use strict'

var express = require('express');
var app = express();
var Usuario = require('../models/usuarioModel');
var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var mdAuth = require('../middlewares/auth');

//GET todos los usuarios
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.status(200).json({
                    usuarios: usuarios
                });
            });
});






// PUT usuario - actualizar usuario
app.put('/:id', mdAuth.verificaToken , (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuarioEncontrado) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar usuario',
                err: err
            });
        }
        if (!usuarioEncontrado) {
            return res.status(400).json({
                message: 'El usuario con el id' + id + 'no existe',
                err: err
            });
        }

        usuarioEncontrado.nombre = body.nombre;
        usuarioEncontrado.email = body.email;
        usuarioEncontrado.role = body.role;

        usuarioEncontrado.save((err, usuarioSaved) => {
            if (err) {
                return res.status(400).json({
                    message: 'Error al actualizar usuario',
                    err: err
                });
            }

            usuarioEncontrado.password = ':)';

            res.status(200).json({
                usuario: usuarioSaved
            });
        });

    });

});


// POST usuarios - crear usuario
app.post('/', mdAuth.verificaToken , (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioSaved) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.status(200).json({
            usuarioSaved,
            usuarioToken: req.usuario
        });
    });
});

//DELETE USER  - eliminar usuario
app.use('/:id', mdAuth.verificaToken , (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDeleted) => {
        if(err) {
            return res.status(500).json({
                err: err,
                message: 'Error al borrar usuario'
            });
        }
        if(!usuarioDeleted) {
            return res.status(400).json({
                err: err,
                message: 'No existe un usuario con ese id'
            });
        }
        return res.status(200).json(usuarioDeleted);
    })
});





module.exports = app;