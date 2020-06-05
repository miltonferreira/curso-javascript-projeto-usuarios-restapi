let NeDB = require('nedb');
let db = new NeDB({
    filename:'users.db',
    autoload: true
});

// let express = require('express');
// let routes = express.Router();
const { check, validationResult } = require("express-validator");

// exportar essa rota para o index principal
module.exports = (app) => {

    let route = app.route('/users');    // indica que é a rota padrao para users

    route.get((req, res) => {

        // ordena por nome de forma crescente
        db.find({}).sort({name:1}).exec((err, users) => {
            if(err){
                app.utils.error.send(err, req, res);    //trata o erro na class error.js
            } else {

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    users: users    // mostra a lista de users
                 });

            }
        });

    });

    route.post(
        [
          check("_name", "O nome é obrigatório.").notEmpty(),        // verifica os campos do body
          check("_email", "Email inválido.").notEmpty().isEmail(),   // verifica os campos do body
        ],
        (req, res) => {
            let errors = validationResult(req);
     
            if (!errors.isEmpty()) {
            app.utils.error.send(errors, req, res);                 //trata o erro na class error.js
            return false;
        }

            // nao tá funcionando a refatoraçao por causa da nova sintaxe do validator
            // if(!app.utils.validator.user(app, req, res)) return false;  // se retorna false é que ouve error
     
            db.insert(req.body, (err, user) => {
                if (err) {
                app.utils.error.send(err, req, res);
                } else {
                res.status(200).json(user);                           // se não houver erro retorna as infos do user
            }
          });
        }
    );

    let routeID = app.route('/users/:id');    // indica que é a rota para procurar um user

    routeID.get((req, res) => {
        db.findOne({_id:req.params.id}).exec((err, user) => {
            if(err){
                app.utils.error.send(err, req, res);    //trata o erro na class error.js
            } else {
                res.status(200).json(user);             // se não houver erro retorna as infos do user
            }
        });
    });

    // rota para atualizar infos do user indicado em sua ID
    routeID.put(
        [
            check("_name", "O nome é obrigatório.").notEmpty(),        // verifica os campos do body
            check("_email", "Email inválido.").notEmpty().isEmail(),   // verifica os campos do body
        ],
        (req, res) => {
        let errors = validationResult(req);
     
        if (!errors.isEmpty()) {
          app.utils.error.send(errors, req, res);                 //trata o erro na class error.js
          return false;
        }
        
        // nao tá funcionando a refatoraçao por causa da nova sintaxe do validator
        // if(!app.utils.validator.user(app, req, res)) return false;  // se retorna false é que ouve error

        db.update({_id: req.params.id}, req.body, err => {
            if(err){
                app.utils.error.send(err, req, res);                                    //trata o erro na class error.js
            } else {
                res.status(200).json(Object.assign(req.params, req.body));              // se não houver erro retorna as infos do user
            }
        });

    });

    // indica qual user deletar
    routeID.delete((req, res) => {
        db.remove({_id: req.params.id}, {}, err => {
            if(err){
                app.utils.error.send(err, req, res);            //trata o erro na class error.js
            } else {
                res.status(200).json(req.params);               // se não houver erro retorna o ID deletado
            }
        });
    });    
    
    app.get('/users/admin', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
         res.json({
            users:[{
                name: 'Hcode Masters',
                email: 'admin@hcode.com.br',
                id: 0
            }] 
        });
    });
};