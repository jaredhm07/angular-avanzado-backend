var express = require('express');
var Usuario = require('../models/usuarioModel');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();


app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                message: 'Error al encontrar usuario',
                err: err
            });
        }

        if(!usuarioDB) {
            return res.status(500).json({
                message: 'Credenciales incorrectas - email',
                err: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                message: 'Credenciales incorrectas - password',
                err: err
            });
        }

        //Crear TOKEN
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED,{ expiresIn: 14400}) //4 horas
       

        res.status(200).json({
            message: 'Login post correct',
            body: body,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
         });

    });
    
})


module.exports = app;