const express = require("express");
var router = express.Router();
var movies = loadMovies();
const app = express();
app.use(express.json());

function loadMovies() {
  const movies = [
    { title: "Star Wars", id: 1 },
    { title: "El Señor de los Anillos", id: 2 },
    { title: "Harry Potter", id: 3 }
  ];
  return movies;
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
    }
  }
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const movieIndex = movies.findIndex(movie => movie.id == id);
  movies.slice(movieIndex, 1);
  // Con lodash:_.remove(movies, movie);   Buscar manera de hacerlo.
  res.json({ message: "OK" });
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
});
module.exports = router;
