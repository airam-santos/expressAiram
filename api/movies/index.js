var express = require("express");
var router = express.Router();
var movies = loadMovies();
function loadMovies() {
  const movies = [
    { title: "Star Wars", id: 1 },
    { title: "El Señor de los Anillos", id: 2 },
    { title: "Harry Potter", id: 3 }
  ];
  return movies;
}
router.get("/", (req, res) => {
  res.json(movies);
});

router.get("/:id", (req, res) => {
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

module.exports = router;
