import express from 'express';

//rutas
import router from './router';

//DB
import {connectDB} from './config/db'

//ENV
import 'dotenv/config';

import cors from 'cors';
import {corsConfig} from './config/cors'

connectDB();
const app = express();

//cors

app.use(cors(corsConfig));

//Leer datos del body
app.use(express.json());

//ruta principal
app.use("/", router)


export default app;