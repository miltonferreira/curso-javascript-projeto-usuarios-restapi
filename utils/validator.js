module.exports = {

    user:(app, req, res) => {
		
		req.assert('_name', 'O nome é obrigatório').notEmpty();
		req.assert('_email', 'O e-mail está inválido').notEmpty().isEmail();
        
        let errors = validationResult(req);
     
        if (!errors.isEmpty()) {
          app.utils.error.send(errors, req, res);                 //trata o erro na class error.js
          return false;
        } else {
            return true;
        }
    }

};