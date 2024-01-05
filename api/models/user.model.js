import mongoose from 'mongoose';

// Create schema for user
const userSchema = new mongoose.Schema({
    // Username - string, required, and unique
    username: {
        type: String,
        required: true,
        unique: true,
    },
    // Email - string, required, and unique
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Password - string and required
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png"
    },
}, { timestamps: true }); // Use timestamp to sort information 

// Model - pass in user schema 
const User = mongoose.model('User', userSchema);
// Export model
export default User;