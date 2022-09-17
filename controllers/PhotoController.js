const Photo = require('../models/Photo');
const User = require('../models/User');

const mongoose = require('mongoose');

const insertPhoto = async (req, res) => {
    const { title } = req.body
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

    if (!newPhoto) {
        res.status(422).json({
            errors: ['Houve um problema por favor tente mais tarde.'],
        })
        return
    }

    res.status(200).json({ newPhoto })
}

const deletePhoto = async (req, res) => {
    const { id } = req.params

    const reqUser = req.user

    const photo = await Photo.findById(mongoose.Types.ObjectId(id))
    //check if the photo exists
    if (!photo) {
        res.status(404).json({
            errors: ['Houve um problema por favor tente mais tarde.'],
        })
        return
    }

    //check if the photo belongs to user
    if (!photo.userId.equals(reqUser.id)) {
        res.status(422).json({
            errors: ['Houve um problema por favor tente mais tarde.']
        })
        return
    }

    await Photo.findByIdAndDelete(photo.id)

    res.status(200).json({
        id: photo.id, message: 'photo excluída com sucesso.'
    })

}
//Get all photos
const getAllPhotos = async (req, res) => {

    const photos = await Photo.find({}).sort([['createdAt', -1]]).exec()

    console.log(photos)
    return res.status(200).json(photos)

}
//Get User Photos
const getUserPhotos = async (req, res) => {

    const { id } = req.params

    const photos = await Photo.find({ userId: id }).sort([['createdAt', -1]]).exec()

    return res.status(200).json(photos)
}
//Get User Photo byId
const getPhotoById = async (req, res) => {

    const { id } = req.params

    const photo = await Photo.findById(mongoose.Types.ObjectId(id))

    if (!photo) {
        res.status(400).json({ error: ['Foto não encontrada.'] })

        return
    }
    res.status(200).json({ photo })
}
// Update Photo
const updatePhoto = async (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const reqUser = req.user

    const photo = await Photo.findById(id)

    //check if photo exists
    if (!photo) {
        res.status(404).json({
            errors: ['Foto não encontrada.']
        })
        return
    }
    //check if photo belong to user
    if (!photo.userId.equals(reqUser.id)) {
        res.status(422).json({
            errors: ['Houve um erro, por favor tente novamente mais tarde.']
        })
        return
    }

    if (title) {
        photo.title = title
    }
    await photo.save()

    res.status(200).json({ photo, message: 'Foto atualizada com sucesso.' })

}
//Likes in photos
const likePhoto = async (req, res) => {

    const { id } = req.params
    const reqUser = req.user

    try {
        const photo = await Photo.findById(id)

        //check if photo exists
        if (!photo) {
            res.status(404).json({ errors: ['Foto não encontrada #1'] })
            return
        }

        //check if user already liked the photo
        if (photo.likes.includes(reqUser._id)) {
            res.status(422).json({ errors: ['Você curtiu a foto.'] })
            return
        }

        //Put user id in Likes array
        photo.likes.push(reqUser._id)

        await photo.save()

        res.status(200).json({ photoId: id, userId: reqUser.id, message: 'A foto foi curtida.' })

    } catch (error) {
        console.log(id)
        res.status(404).json({ errors: ['Foto não encontrada #2'] })
        return;
    }

}
// Commentary photo
const commentPhoto = async (req, res) => {
    const {id} = req.params
    const {comment} = req.body
    const reqUser = req.user

    const user = await User.findById(reqUser.id)

    const photo = await Photo.findById(id)

    //check if photo exists
    if(!photo) {
        res.status(404).json({ errors: ['Foto não encontrada #1']})
        return
    }

    //Push comment users in Array comments
    const userComment =
    {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    }

    photo.comments.push(userComment)

    await photo.save()

    res.status(200).json({
        comment: userComment,
        message: 'Comentario adicionado.'
    })

}

//Search photos
const searchPhotos = async (req, res) => {
    const {q} = req.query

    const photos = await Photo.find( {title: new RegExp(q, 'i') } ).exec()

    res.status(200).json(photos);
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
}