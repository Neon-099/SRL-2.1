
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


import User from '../models/user.model.js'
import { JWT_SECRET, JWT_EXPIRES_IN} from '../config/env.js';

export const signUp = async(req, res, next) => {
    //IMPLEMENT THE SIGN UP LOGIC
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password} = req.body;

        //CHECK IF USERS ALREADY EXISTS
        const existingUser = await User.findOne( { email });

        if(existingUser){
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        //HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserArr = await User.create([{name, email, password: hashedPassword}], {session});
        //GET ID SEPARATELY (issue)
        const newUser = newUserArr[0];

        const token = jwt.sign( {userId: newUser._id }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: { _id: newUser._id, name: newUser.name, email: newUser.email }
            }
        })
    
    }
    catch (error){
        await session.abortTransaction();  //CATCH atom ope (DONT DO ANYTHING, ABORT)
        session.endSession()
        next(error);
    }
}

export const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // CHECK IF USER EXISTS
        const user = await User.findOne({ email });
        //IF USER DOENST EXISTS
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        // CHECK IF PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401; // Unauthorized
            throw error;
        }
        // CREATE AND SIGN TOKEN
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user: { _id: user._id, name: user.name, email: user.email }
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async(req, res, next) => {
    // Sign-out is typically handled on the client by clearing the token.
    // This endpoint is for acknowledgement.
    res.status(200).json({ success: true, message: 'User signed out successfully' });
}