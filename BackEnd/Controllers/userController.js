const User = require ('../Models/userModel')
const bcrypt = require("bcryptjs");
const cloudinary = require ('cloudinary').v2
const jwt = require ('jsonwebtoken')
// const asyncHandler = require('express-async-handler');

const signup = async (req,res)=>{
    try {
        console.log('Incoming Body:', req.body);
        console.log('Incoming file:', req.file);

        const {name,email,password} = req.body


    const userExist = await User.findOne({email})
    if(userExist){
        return res.status(400).json({message:'User already existed with this email'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let imageUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'user_profiles' },
          (error, result) => {
            if (error) {
              return reject(new Error('Cloudinary upload failed: ' + error.message));
            }
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url; 
      console.log('Cloudinary Upload Result:', result);
      
    }
    
    const insertUser = new User({
        name,
        email,
        password:hashedPassword,
        image:imageUrl
    })


    const savedUSer = await insertUser.save()

    const token = jwt.sign({ id: savedUSer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      _id: savedUSer._id,
      name: savedUSer.name,
      email: savedUSer.email,
      image: savedUSer.image,
    });

    } catch (error) {
       console.error('Signup error',error)
       res.status(500).json({message:'Something went wrong during Signup' + error.message}) 
    }
}

const Login = async (req,res)=>{
  try {
    const {email,password} = req.body

    if(!email|| !password){
      return res.status(400).json({message:'Email and password are required'})
    }

    const user = await User.findOne({email})
    if(!user){
      return res.status(401).json({message:'Invalid email and password'})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      res.status(400).json({message:"Invalid email or password"})
    }

    const token = jwt.sign({id:user._id},
      process.env.JWT_SECRET,
      {expiresIn:'1h'})

      console.log('Generated token:', token);
    res.json({ _id: user._id,
       name: user.name,
       email: user.email,
       image: user.image, 
       role: user.role, 
       token })
  } catch (error) {
    console.error('Login error',error)
    res.status(500).json({message:'Something went Wrong during login:' + error.message})
  }
}

const updateProfile = async (req,res)=>{
  try {
    const {name,email} =req.body
    const userId = req.user.id 
    if(!name ||!email){
      return res.status(400).json ({message:'Name and email are required'})
    }
    const existingUser = await User.findOne({email, _id:{$ne:userId}})
    if(existingUser){
      return res.status(400).json({message:'Email already in use'})
    }
    let imageUrl = req.body.image ||'';
    if(req.file){
      const result = await new Promise((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream(
          {resource_type:'image',folder:'user_profiles'},
          (error,result)=>{
            if(error){
              return reject (new Error('Cloudinary upload failed: ' + error.message))
            }
            resolve(result)
        })
        stream.end(req.file.buffer);
      })
      imageUrl = result.secure_url
    }
    const updatedUser = await User.findByIdAndUpdate(userId,{name,email, image:imageUrl},{new:true})
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      image:updatedUser.image,
    })
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Update failed: ' + error.message });
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let imageUrl = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'user_profiles' },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }
    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      role: role || 'user',
    });
    await user.save();
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existed email 
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Handle image upload
    let imageUrl = user.image;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'user_profiles' },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, image: imageUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the last admin
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(403).json({ message: 'Cannot delete the last admin' });
      }
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { signup, Login, updateProfile,getUsers,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
   
};



