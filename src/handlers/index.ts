import { Request, Response } from "express";
import UserModel from "../Models/User";

export const createAccount = async (req: Request, res: Response) => {
    const User = new UserModel(req.body);
  await User.save();
  res.send("registered user");
};
