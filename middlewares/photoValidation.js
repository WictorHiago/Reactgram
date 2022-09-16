const {body} = require('express-validator');

const photoInsertValidation = () => {
 return[
    body('title')
    .not()
    .equals('undefined')
    .withMessage('O titulo e obrigatorio')
    .isString()
    .withMessage('O titulo e obrigatorio')
    .isLength({min: 3})
    .withMessage('O titulo precisa ter pelo menos 3 caracteres'),

    body('image').custom((value, {req}) => {
        if(!req.file) {
            throw new Error('A imagem é obrigatorio')
        }
        return true
    })
 ]
    
}

module.exports = {
    photoInsertValidation,
}