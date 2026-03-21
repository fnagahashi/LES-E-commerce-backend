import { NextFunction, Response } from "express";
import { AuthRequest } from "../DAO/Interface/AuthRequest";

export function ensureAdmin(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
): void {
  if (request.role !== "ADMIN") {
    response.status(403).json({
      message: "Acesso negado: apenas administradores",
    });
    return;
  }

  next();
}