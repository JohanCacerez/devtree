import { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
import UserModel from "../Models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export const createAccount = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  //verificamos que el email este disponible
  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    //creamos un error si el usuario ya existe
    const error = new Error("email already exists");
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
    const error = new Error("Name already exists");
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
  res.status(201).send("registered user");
};

export const login = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  //verificamos que el email este disponible
  const user = await UserModel.findOne({ email });

  if (!user) {
    //creamos un error si el usuario no existe
    const error = new Error("email not found");
    //mandamos el error al cliente y detenemos la ejecución
    return res.status(404).json({ error: error.message });
  }

  //comprobamos la contraseña
  const isPasswordValid = await checkPassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("invalid password");
    return res.status(401).json({ error: error.message });
  }

  //si todo es correcto, devolvemos el usuario
  res.status(200).json({ user });
}
