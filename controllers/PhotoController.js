const Photo = require('../models/Photo');
const User = require('../models/User');

const mongoose = require('mongoose');

const insertPhoto = async (req, res) => {
    const {title} = req.body
    const image = req.file.filename

    const reqUser = req.user

    const user = await User.findById(reqUser._id);

    //create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        username: user.name,
    })

    if(!newPhoto) {
        res.status(422).json({
            errors: ['Houve um problema por favor tente mais tarde '],
        })
        return
    }

    res.status(200).json({newPhoto})
}

const deletePhoto = async (req, res) => {
    const { id } = req.params

    const reqUser = req.user


    try {
        const photo = Photo.findById(mongoose.Types.ObjectId(id))
    console.log(photo)

    //check if the photo exists
    if(!photo) {
        res.status(404).json({
            errors: ['houve um problema por favor tente mais tarde'],
        })
        return
    }

    //check if the photo belongs to user
    if(!photo.userId.equals(reqUser.id)) {
        res.status(422).json({
            errors: ['Houve um problema por favor tente mais tarde']
        })
        return
    }
    
    await Photo.findByIdAndDelete(photo._id)
    res.status(200).json({
        id: photo.id, message: 'photo excluida com sucesso'
    })


    } catch (error) {
        res.status(404).json({errors: ['Houve um problema por favor tente mais tarde 2']})
        return;
    }
    
}

module.exports = {
    insertPhoto,
    deletePhoto,
}