const { body } = require('express-validator')

const userCreateValidation = () => {
    return [
        //field name
        body('name')
        .isString()
        .withMessage('O nome é obrigat.')
        .isLength({min: 3})
        .withMessage('O nome precisa ter 3 caracteres.'),
        //field email
        body('email').isString()
        .withMessage('O email é obrigatório.')
        .isEmail()
        .withMessage('Insira um email válido.'),
        //field password
        body('password')
        .isString()
        .isLength({min: 6})
        .withMessage('A senha precisa ter no mínimo 6 caracteres.'),
        //compare password
        body('confirmPassword')
        .isString()
        .withMessage('A confirmação de senha é obrigatória.')
        .custom( (value, {req} )=> {
            if(value != req.body.password){
                throw new Error('As senhas não são iguais.')
            }
            return true
        })
    ]
}

const loginValidation = () => {
    return [
        body('email')
        .isString()
        .withMessage('O email é obrigatório.')
        .isEmail()
        .withMessage('Insira um email válido'),
        
        //password
        body('password')
        .isString().withMessage('A senha é obrigatoria')
    ]
}

const userUpdateValidation = () => {

    return [
        body('name')
        .optional()
        .isLength({min:3})
        .withMessage('O nome precisa ter pelo menos 3 caracteres'),

        body('password')
        .optional()
        .isLength({min:6})
        .withMessage('A senha precisa ter pelo menos 6 caracteres'),
    ]
}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
}