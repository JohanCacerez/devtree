import { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
import jwt from "jsonwebtoken";
import UserModel from "../Models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //verificamos que el email este disponible
  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    //creamos un error si el usuario ya existe
    const error = new Error("El correo ya está en uso");
    //mandamos el error al cliente y detenemos la ejecución
    return res.status(409).json({ error: error.message });
  }

  //asignamos un handle al usuario
  //slug es una librería que convierte un string en un slug
  const handle = slug(req.body.handle, "");

  //verificar disponibilidad del handle
  const handleExists = await UserModel.findOne({ handle });

  if (handleExists) {
    //creamos un error si el nombre ya existe
    const error = new Error("Este nombre de usuario ya está en uso");
    //mandamos el error al cliente y detenemos la ejecución
    return res.status(409).json({ error: error.message });
  }

  //nuevo usuario
  const User = new UserModel(req.body);
  //hasheamos la contraseña
  User.password = await hashPassword(password);
  //asignamos el handle al usuario
  User.handle = handle;

  //guardamos el usuario en la base de datos
  await User.save();
  //enviamos una respuesta al cliente
  res.status(201).send("Usuario registrado correctamente");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //verificamos que el email este disponible
  const user = await UserModel.findOne({ email });

  if (!user) {
    //creamos un error si el usuario no existe
    const error = new Error("Correo no encontrado");
    //mandamos el error al cliente y detenemos la ejecución
    return res.status(404).json({ error: error.message });
  }

  //comprobamos la contraseña
  const isPasswordValid = await checkPassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Contraseña incorrecta");
    return res.status(401).json({ error: error.message });
  }

  const token = generateJWT({ id: user._id });

  //si todo es correcto, devolvemos el usuario
  res.send(token);
};

export const getUser = async (req: Request, res: Response) => {
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
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al verificar el token" });
  }
};
