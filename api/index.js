import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

//Initialize dotenv
dotenv.config();

// Connect to database and check if connected to the database using console log
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
    }).catch((err) => {
        console.log(err);
    });

// Dynamic path name
const __dirname = path.resolve();


// Declare express as constant 
const app = express();

// JSON can be input to server
app.use(express.json());

// Information from cookie
app.use(cookieParser());

// Port where server runs
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);

// Test API route
app.use('/api/user', userRouter);

// Auth route
app.use('/api/auth', authRouter);

// Listing router
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

// Middleware to handle errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

