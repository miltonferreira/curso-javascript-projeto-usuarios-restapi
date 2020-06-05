const express = require('express');
const consign = require('consign');
const bodyParse = require('body-parser');
const expressValidator = require('express-validator');
// let routesIndex = require('./routes/index.js');
// let routesUsers = require('./routes/users.js');

let app = express();                                    // retorna a aplicação feita

app.use(bodyParse.urlencoded({extended: false, limit: '50mb' }));      // ajuda no postman no x-www-form-urlencoded
app.use(bodyParse.json({limit: '50mb'}));                              // converte os dados para json pelo post
// app.use(expressValidator());                            // validador de dados do express

consign().include('routes').include('utils').into(app);                  // indica a pasta com as rotas do app

// app.use(routesIndex);   // indica a rota para o express
// app.use('/users', routesUsers);   // indica a rota para o express



app.listen(4000, '127.0.0.1', () => {
    console.log('Servidor rodando!');
});