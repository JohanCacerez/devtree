import {Router} from 'express';

const router = Router();

//routing
router.get("/", (req, res) => {
  res.send("Hello, World!");
});

router.get("/about", (req, res) => {
  res.send("About Page");
});

router.get("/contact", (req, res) => {
  res.send("Contact Page");
});

export default router;