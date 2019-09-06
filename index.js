'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3700;

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true})
        .then( () => {
            console.log('Conexión a hospital DB establecida con éxito');

            //  Creación del servidor
            app.listen(port, () => {
                console.log('Servidor corriendo en puerto: ' + port);
            });
        })
        .catch(err => console.log(err));