import { Router } from "express";
import { createAccount, login } from "./handlers";
import { body } from "express-validator";

const router = Router();

//Autenticacion y registro
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle esta vacio"),
  body("name").notEmpty().withMessage("El nombre esta vacio"),
  body("email").isEmail().withMessage("El email esta vacio"),
  body("password").isEmpty().isLength({ min: 8 }).withMessage("La contraseña es minimo de 8 caracteres"),

  createAccount
);

router.post(
  "/auth/login",
  body("email").notEmpty().withMessage("El email esta vacio"),
  body("password").notEmpty().withMessage("La contraseña esta vacia"),
  login
);

export default router;
