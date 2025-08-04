const express = require('express');
const userRoute = express.Router();
// const userController = require('../Controllers/userController') 
const multer = require('multer')

const storage = multer.memoryStorage()    //memoryStorage- stores the uploaded files in image
const upload = multer({storage})
const { signup, Login, updateProfile, getUsers, searchUsers, createUser, updateUser, deleteUser } = require('../Controllers/userController');
const authMiddleware = require('../Middleware/auth');




userRoute.post('/signup',upload.single('image'),signup)
userRoute.post('/login',Login)
userRoute.put('/profile',authMiddleware.protect,upload.single('image'), updateProfile)

// only authenticated, admin can only access the user 
userRoute.get('/users', authMiddleware.protect, authMiddleware.admin, getUsers); 

userRoute.get('/search', authMiddleware.protect, authMiddleware.admin, searchUsers); 
userRoute.post('/create', authMiddleware.protect, authMiddleware.admin, upload.single('image'), createUser); 
userRoute.put('/:id', authMiddleware.protect, authMiddleware.admin, upload.single('image'), updateUser); 
userRoute.delete('/:id', authMiddleware.protect, authMiddleware.admin, deleteUser); 
module.exports=userRoute