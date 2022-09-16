const { body } = require('express-validator')

const userCreateValidation = () => {
    return [
        //field name
        body('name')
        .isString()
        .withMessage('o nome é obrigatorio')
        .isLength({min: 3})
        .withMessage('o nome precisa ter 3 caracteres'),
        //field email
        body('email').isString()
        .withMessage('o email é obrigatorio')
        .isEmail()
        .withMessage('insira um email válido'),
        //field password
        body('password')
        .isString()
        .isLength({min: 6})
        .withMessage('a senha precisa ter no minimo 6 caracteres'),
        //compare password
        body('confirmPassword')
        .isString()
        .withMessage('a confirmação de senha é obrigatorio')
        .custom( (value, {req} )=> {
            if(value != req.body.password){
                throw new Error('As senhas não são iguais')
            }
            return true
        })
    ]
}

const loginValidation = () => {
    return [
        body('email')
        .isString()
        .withMessage('O email é obrigatorio')
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