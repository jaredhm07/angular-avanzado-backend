'use strict'

var UsuarioModel = require('../models/usuarioModel');
var fs = require('fs');

var usuarioController = {
    home: function(req, res) {
        return res.status(200).send({
            message: 'Get usuarios'
        });
    },
}
