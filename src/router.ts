import { Router } from "express";
import { createAccount, getUser, login } from "./handlers";
import { body } from "express-validator";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router();

//Autenticacion y registro
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle esta vacio"),
  body("name").notEmpty().withMessage("El nombre esta vacio"),
  body("email").isEmail().withMessage("El email esta vacio"),
  body("password").notEmpty().isLength({ min: 6 }).withMessage("La contraseña es minimo de 6 caracteres"),
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email").notEmpty().withMessage("El email esta vacio"),
  body("password").notEmpty().withMessage("La contraseña esta vacia"),
  handleInputErrors,
  login
);

router.get('/user', authenticate, getUser)

export default router;
