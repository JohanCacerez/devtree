import express from 'express';

//rutas
import router from './router';

const app = express();

//Leer datos del body
app.use(express.json());

app.use("/", router)


export default app;