import {Router} from 'express';
import User from './Models/User';

const router = Router();

//Autenticacion y registro
router.post('/auth/register', async (req, res) => {
  console.log(req.body);
  await User.create(req.body)
  res.send("registered user");

});

export default router;  