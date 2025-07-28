import { Request, Response } from "express";
import UserModel from "../Models/User";

export const createAccount = async (req: Request, res: Response) => {
  const {email} = req.body;
  const userExists = await UserModel.findOne({ email });
  //verificamos si el usuario ya existe
  if (userExists) {
    //creamos un error si el usuario ya existe
    const error = new Error("User already exists");
    //mandamos el error al cliente y detenemos la ejecución
    return res.status(409).json({error: error.message});
  }
  const User = new UserModel(req.body);
  await User.save();
  res.status(201).send("registered user");
};
