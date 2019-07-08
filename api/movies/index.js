const express = require("express");
const fs = require("fs");
const router = express.Router();
//const movies = require("./db.json"); //Carga el fichero solo cuando se arranca el servidor.
const app = express();
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

/*MongoClient.connect(url, function(err, db) {
  console.log("Connected");
  db.close();
});*/
MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  // Client returned
  let db = client.db("movies");
});

let movies = [{}];

MongoClient.connect("mongodb://localhost", function(err, client) {
  if (err) throw err;

  db = client.db("movies");

  db.collection("movies").find({}, function(findErr, result) {
    if (findErr) throw findErr;
    movies.push(result);
    client.close();
  });
});

function saveMovies() {
  fs.writeFile("./api/movies/db.json", JSON.stringify(movies), function(err) {
    if (err) throw err;
    console.log("Saved!");
  });
}

router.get("/", (req, res) => {
  //Gets all movies.
  res.json(movies);
});

router.get("/:id", (req, res) => {
  //Searchs for movie by id.
  const id = req.params.id;

  if (isNaN(id)) {
    res.status(400).send("Debes pasarme un número");
  } else {
    const movie = movies.find(movie => movie.id == id);
    if (movie == undefined) {
      return res.status(400).send("Error, no se ha encontrado el id.");
    } else {
      return res.send(movie);
    }
  }
});
function bodyIsEmpty(body) {
  if (body.title == undefined) {
    return true;
  }
}
router.post("/newmovie", (req, res) => {
  //Adds new movie.
  if (bodyIsEmpty(req.body)) {
    res.status(400).send("Debes pasar algo en el Body");
  } else {
    const newMovie = req.body;
    newMovie.id = movies[movies.length - 1].id + 1;
    movies.push(newMovie);
    res.json(newMovie);
    saveMovies();
  }
});

router.put("/update/:id", (req, res) => {
  //Updates movie,
  const id = req.params.id;

  if (isNaN(id)) {
    res.status(400).send("Debes pasarme un número");
  } else {
    const oldMovie = movies.find(movie => movie.id == id);
    const position = movies.findIndex(movie => movie.id == id);

    if (oldMovie == undefined) {
      return res.status(400).send("Error, no se ha encontrado el id.");
    } else {
      const newMovie = req.body;
      const movieToInsert = { ...oldMovie, ...newMovie, id };
      movies[position] = movieToInsert;
      res.json(movies[position]);
      saveMovies();
    }
  }
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const movieIndex = movies.findIndex(movie => movie.id == id);
  //movies.slice(movieIndex, 1);
  delete movies[movieIndex];
  res.json({ message: "OK" });
  saveMovies();
});

router.put("/like/:id", (req, res) => {
  //Adds like to movie.
  const id = req.params.id;
  const movie = movies.find(movie => movie.id == id);
  const position = movies.findIndex(movie => movie.id == id);
  if (movie.likes == undefined) {
    const likes = 1;
    const movieToInsert = { ...movie, likes };
    movies[position] = movieToInsert;
    res.json(movies[position]);
  } else {
    movie.likes = movie.likes + 1;
    res.json(movies[position]);
  }
  saveMovies();
});

router.put("/dislike/:id", (req, res) => {
  //Removes like from movie.
  const id = req.params.id;
  const movie = movies.find(movie => movie.id == id);
  const position = movies.findIndex(movie => movie.id == id);
  if (movie.likes == undefined) {
    const likes = 0;
    const movieToInsert = { ...movie, likes };
    movies[position] = movieToInsert;
    res.json(movies[position]);
  } else {
    if (movie.likes < 1) {
      movie.likes = 0;
    } else {
      movie.likes = movie.likes - 1;
    }

    res.json(movies[position]);
  }
  saveMovies();
});

module.exports = router;
