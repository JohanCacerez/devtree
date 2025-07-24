import express from 'express';

const app = express();

//routing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;