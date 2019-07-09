const express = require("express");
const app = require("express")();
app.use(express.json());
const moviesRouter = require("./api/movies");
app.use("/movies", moviesRouter);
const methodOverride = require("method-override");
const notifier = require("node-notifier");

function errorHandler(err, req, res, next) {
  if (!err) {
    return next();
  }
  const message = `Error en ${req.method} ${req.url}`;
  notifier.notify({ title: "Error", message });
  res.status(500).send("Algo se ha roto");
}

app.use(methodOverride());
app.use(errorHandler);

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

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

app.listen(3000, () => console.log("Ready on port 3000!"));
