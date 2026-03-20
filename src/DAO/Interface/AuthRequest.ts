import { Request } from "express";

export interface AuthRequest extends Request {
  email: string;
  id: string;
  role: string;
}