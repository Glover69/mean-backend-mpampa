// // user.model.ts
// import mongoose from 'mongoose';
// require('dotenv').config(); // Load environment variables from .env file

// mongoose.connect(process.env.ATLAS_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const userSchema = new mongoose.Schema({
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
// });

// const users = mongoose.model('users', userSchema);

// export default users;
