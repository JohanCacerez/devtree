import type { NextFunction, Response, Request } from 'express';
import jwt from "jsonwebtoken";
import UserModel, {IUser} from "../Models/User";

// Importando el modelo de usuario para definir la interfaz IUser
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({ message: "No se ha proporcionado un token de autenticación" });
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof result === "object" && result.id) {
      const user = await UserModel.findById(result.id).select("-password -__v");
      if (!user) {
        return res.status(404).json({ message: "El usuario no existe" });
      }
      req.user = user;
      return next();
    }

    return res.status(401).json({ message: "Token inválido" });

  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
