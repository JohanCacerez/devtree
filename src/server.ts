import express from 'express';

//rutas
import router from './router';

//DB
import {connectDB} from './config/db'

//ENV
import 'dotenv/config';

const app = express();

connectDB();

//Leer datos del body
app.use(express.json());

app.use("/", router)


export default app;