import  { Request, Response, NextFunction } from 'express';
import {verify} from "jsonwebtoken"
import { AuthRequest } from '../DAO/Interface/AuthRequest';

interface IPayload{
    sub: string; email: string;
}


export function ensureAuthenticated (request: Request, response: Response, next: NextFunction){
    const authToken = request.headers.authorization;
    if (!authToken){
        response.status(401).end();
        return;
    }
    const [, token] = authToken.split(" ");
    try{
        const {sub, email} = verify(token, "ecommerce") as IPayload;
        const req = request as AuthRequest;
          req.userId = sub;
          req.email = email;
        next();
    } 
    catch(err){
        response.status(401).json({message: "Token inválido!"});
        return;
    }
}