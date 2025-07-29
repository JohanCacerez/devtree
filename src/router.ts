import { Router } from "express";
import { createAccount } from "./handlers";
import { body } from "express-validator";

const router = Router();

//Autenticacion y registro
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle es obligatorio"),
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El email es obligatorio"),
  body("password").isEmpty().isLength({ min: 8 }).withMessage("La contraseña es obligatoria"),

  createAccount
);

export default router;
