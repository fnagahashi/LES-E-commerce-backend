import { verify } from "jsonwebtoken";
import { AuthRequest } from "../DAO/Interface/AuthRequest";
import { NextFunction, Request, Response } from "express";

interface IPayload {
  email: string;
  id: string;
  role: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    response.status(401).end();
    return;
  }

  const [, token] = authToken.split(" ");

  try {
    const { email, id, role } = verify(token, "ecommerce") as IPayload;

    const req = request as AuthRequest;

    req.email = email;
    req.id = id;
    req.role = role;

    next();
  } catch {
    response.status(401).json({ message: "Token inválido!" });
  }
}
