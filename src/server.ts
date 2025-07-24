import express from 'express';

//rutas
import router from './router';

const app = express();

app.use("/", router)


export default app;