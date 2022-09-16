const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

// Generate User token
const generateToken = (id) => {
    return jwt.sign( {id}, jwtSecret, {
        expiresIn: '7d',
    });
}

//Rgister User and sign in
const register = async(req, res) => {

    const {name, email, password} = req.body

    //check if user exists
    const user = await User.findOne({email})

    if(user) {
        res.status(422).json({errors: ['por favor, utilize outro email']})
        return
    }

    //Generate Password hash
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    //create User
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    //if user was created successfully return TOKEN
    if(!newUser) {
        res.status(422).json({errors:['houve um erro, por favor tente mais tarde'] })
        return
    }
    res.status(201).json({
        id: newUser.id,
        token: generateToken(newUser.id)
    })

};

const login = async (req, res) => {

    const {email, password,} = req.body

    const user = await User.findOne({email})

    //check if user exists
    if(!user) {
        res.status(404).json({errors:['Usuario não encontrado']})
        return
    }
    //check if password matches
    if( !(await bcrypt.compare(password, user.password))) {
        res.status(422).json({errors:['Senha inválida']})
        return
    }

    //return user with token
    res.status(201).json({
        id:user.id,
        profileImage: user.profileImage,
        token: generateToken(user.id)
    })

}

//Get current logged in user
const getCurrentUser = async (req, res) => {
    const user = req.user;

    res.status(200).json({user});
}

//Update an user
const update = async (req, res) => {
    const {name, password, bio} = req.body;

    let profileImage = null

    if(req.file){
        profileImage = req.file.filename;
    }
    const reqUser = req.user
    
    const user = await User.findById(mongoose.Types.ObjectId(reqUser.id)).select('-password')

    if(name) {
        user.name = name
    }

    if(password) {
        //Generate Password hash
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
    }

    if(profileImage) {
        user.profileImage = profileImage
    }

    if(bio) {
        user.bio = bio
    }
    await user.save()

    res.status(200).json(user);
}

module.exports ={
    register,
    login,
    getCurrentUser,
    update
}