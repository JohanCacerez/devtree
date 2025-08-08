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

  //verificamos que el token de autenticación exista
  if (!bearer) {
    const error = new Error("No se ha proporcionado un token de autenticación");
    return res.status(401).json({ error: error.message });
  }

  //verificamos que el token de autenticación sea válido
  const [, token] = bearer.split(" ");

  //verificamos que el token no sea nulo o indefinido
  if (!token) {
    const error = new Error("Token de autenticación inválido");
    return res.status(401).json({ error: error.message });
  }

  //verificamos el token y obtenemos el usuario
  try {
    // Verificamos el token
    const result = jwt.verify(token, process.env.JWT_SECRET);
    // Si el token es válido, buscamos al usuario por su ID
    if (typeof result === "object" && result.id) {
      const user = await UserModel.findById(result.id).select("-password -__v");
      if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ error: error.message });
      }
      req.user = user; // Asignamos el usuario a la solicitud
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Error al verificar el token" });
  }
}