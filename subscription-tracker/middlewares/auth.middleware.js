import { JWT_SECRET } from "../config/env.js";
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js";


const authorize = async (req, res, next) => {
    try {
        let token;

        //WHEN SOMEONE IS TRYING TO MAKE A REQUEST: it verify
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        //CHECK IF TOKEN IS VALID
        if(!token) return res.status(401).json({message: 'Unauthorized'});
            
        //DECODE TOKEN SINCE since it extracts token in HEADERS
        const decoded = jwt.verify(token, JWT_SECRET);

        //VERIFIES THE CURRENT USERS by checking ID and token if not expired or deprecated
        const user = await User.findById(decoded.userId);

        if(!user) return res.status(401).json({message: 'Unauthorized'});

        req.user = user;
    }
    catch (error){
        res.status(401).json({ message: 'Unauthorized', error: error.message});
        next(error)
    }
}

export default authorize;

