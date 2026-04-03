import { Request, Response, NextFunction } from "express";

export function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Não autenticado" })
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({ error: "Acesso negado" })
    return;
  }

  next();
}
