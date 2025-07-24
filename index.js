import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

//routing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.get("/about", (req, res) => {
  res.send("About Page");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
