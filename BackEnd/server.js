const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2
const path = require('path');

const userRoute = require('./Routes/userRoute');


dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello from Express');
});

mongoose.connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log(' MongoDB Atlas Connected');
  })
  .catch((error) => {
    console.log(' MongoDB Connection Error:', error.message);
  });

app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));  
app.use('/api/users', userRoute);
// app.use('/admin', adminRoute);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});