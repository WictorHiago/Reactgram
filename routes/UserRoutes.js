const express = require('express');
const router = express.Router();

//controller
const {register, login, getCurrentUser, update, getUserByid} = require('../controllers/UserController');

// Middlewares
const validate = require('../middlewares/handleValidation');
const {userCreateValidation, loginValidation, userUpdateValidation} = require('../middlewares/userValidations');
const authGuard = require('../middlewares/authGuard');
const { imageUpload } = require('../middlewares/imageUpload');
//Routes
router.post('/register', userCreateValidation(), validate, register);
router.post('/login', loginValidation(), authGuard, validate, login);
router.get('/profile', authGuard, getCurrentUser);
router.put('/', authGuard, userUpdateValidation(), validate, imageUpload.single('profileImage'), update)

router.get('/:id', getUserByid)





module.exports = router;