import type {Request, Response, NextFunction} from 'express';
import { signUp, signIn} from '../services/auth.services.js';
import type { SignUpDto, SignInDto } from '../types/auth.types';

export async function signUpController (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void>{
    try {
        const data : SignUpDto = req.body;

        //BASIC VALIDATION 
        if(!data.email || !data.password){
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }

        if(data.password.length < 8){
            res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
            return;
        }

        const result = await signUp(data)
    
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error){
        next(error);
    }
}

export async function signInController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data: SignInDto = req.body;

        if(!data.email || !data.password){
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }

        const result = await signIn(data);

        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error){
        next(error);
    }
}

export async function signOutController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    // For JWT, signout is typically handled client-side by removing the token
    // But you can implement token blacklisting here if needed
    res.status(200).json({
        success: true,
        message: 'Signed out successfully'
    });
}