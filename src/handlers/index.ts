import { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
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

  generateJWT(user)

  //si todo es correcto, devolvemos el usuario
  res.send('autenticado...')
}
