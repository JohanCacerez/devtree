import {Router} from 'express';
import User from './Models/User';

const router = Router();

//Autenticacion y registro
router.post('/auth/register', async (req, res) => {

  await User.create(req.body)

});

export default router;  