import argon2, { argon2id } from 'argon2';
import jwt, {type SignOptions} from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import type { SignUpDto, SignInDto, AuthResponse } from '../types/auth.types.js';


//ARGON2ID CONFIGURATION
const ARGON2_OPTIONS = {
   type: argon2.argon2id, // Use argon2id variant
  memoryCost: 65536,     // 64 MB memory (adjust based on your needs)
  timeCost: 3,           // Number of iterations
  parallelism: 4,        // Number of threads
}


// ✅ Helper function to ensure JWT_SECRET is valid
function getJwtSecret(): string {
  if (!JWT_SECRET || JWT_SECRET.trim() === '') {
    throw new Error('JWT_SECRET is not configured');
  }
  return JWT_SECRET;
}

// ✅ Helper function to create JWT options
function getJwtOptions(): SignOptions {
  return {
    expiresIn: (JWT_EXPIRES_IN || '1d') as any as SignOptions['expiresIn'] // Ensure it's always a string
  };
}

export async function signUp(data: SignUpDto): Promise<AuthResponse> {
    const { email, password, name} = data;

    //CHECK IF USER ALREADY EXISTS
    const existingUser = await prisma.user.findUnique({
        where: {email: email.toLowerCase() } 
    });

    if(existingUser){
        throw new Error('User already exists');
    }

    //HASH PASSWORD
    const hashedPassword = await argon2.hash(password, ARGON2_OPTIONS);

    //CREATE USER 
    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            name: name || null,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
        },
    });

    //GENERATE JWT TOKEN
    // ✅ Create typed variables that TypeScript can narrow

    const secret = getJwtSecret(); // ✅ Get validated secret
  const options = getJwtOptions(); // ✅ Get typed options
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    secret,
    options
  );

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
        },
        token
    }
}

export async function signIn(data: SignInDto): Promise<AuthResponse> {
    const { email, password } = data;

    //FIND USER 
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase()},
    });

    if(!user) throw new Error('Invalid Credentials');

    //VERIFY PASSWORD WITH ARGON2ID 
    try{
        const isValid = await argon2.verify(user.password, password);

        if(!isValid) throw new Error('Invalid Credentials');
    } 
    catch (error){
        throw new Error("Invalid email or password");
    }

    //GENERATE JWT TOKEN
    const secret = getJwtSecret(); // ✅ Get validated secret
    const options = getJwtOptions(); // ✅ Get typed options
    const token = jwt.sign(
        {userId: user.id, email: user.email},
        secret,
        options
    )

    return {
        user: {
            id: user.id, 
            email: user.email,
            name: user.name || undefined,
        },
        token

    }
}


