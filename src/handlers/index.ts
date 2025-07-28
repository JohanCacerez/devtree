import { Request, Response } from "express";
import UserModel from "../Models/User";
import { hashPassword } from "../utils/auth";

export const createAccount = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  //verificamos que el email no esten vacios
  const userExists = await UserModel.findOne({ email });

  //verificamos si el usuario ya existe
  if (userExists) {
    //creamos un error si el usuario ya existe
    const error = new Error("User already exists");
    //mandamos el error al cliente y detenemos la ejecución
    return res.status(409).json({error: error.message});
  }

  //nuevo usuario
  const User = new UserModel(req.body);
  //hasheamos la contraseña
  User.password = await hashPassword(password);

  //guardamos el usuario en la base de datos
  await User.save();
  //enviamos una respuesta al cliente
  res.status(201).send("registered user");
};
