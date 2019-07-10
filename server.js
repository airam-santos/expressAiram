const express = require("express");
const app = express();
app.use(express.json());
const moviesRouter = require("./api/movies");
app.use("/movies", moviesRouter);
const users = [{ name: "Pepe", id: 0 }, { name: "Juan", id: 1 }];

app.get("/", (req, res) => {
  res.send("Hola");
});
app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find(user => user.id == userId);
  res.json(user);
});
function bodyIsEmpty(body) {
  if (body.name == undefined) {
    return true;
  }
  if (body.name.length < 3) {
    return true;
  }
}
app.post("/newuser", (req, res) => {
  if (bodyIsEmpty(req.body)) {
    res.status(400).send("Debes pasarme algo en el Body");
  } else {
    const newUser = req.body;
    newUser.id = Math.random();
    users.push(newUser);
    res.json(newUser);
  }
});

app.get("/dice", (req, res) => {
  let value = Math.ceil(Math.random() * 6);
  const diceresult = [{ result: value, facenum: 6 }];
  res.json(diceresult);
});

app.get("/dice/:facenumber", (req, res) => {
  const facenum = req.params.facenumber;
  if (isNaN(facenum)) {
    res.send("Error, el número de caras debe ser un número");
  } else {
    let value = Math.ceil(Math.random() * facenum);
    const diceresult = [{ result: value, facenum: facenum }];
    res.json(diceresult);
  }
});

app.listen(3002, () => console.log("Ready on port 3001!"));
