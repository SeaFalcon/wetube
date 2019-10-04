/*
You DONT have to import the Movie with your username.
Because it's a default export we can nickname it whatever we want.
So import Movie from "./models"; will work!
You can do Movie.find() or whatever you need like normal!
*/
import Movie from "./models/Movie";

// Add your magic here!
// Index
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ title: -1 });
    console.log(movies);
    res.render("home", { pageTitle: "Home", movies });
  } catch (err) {
    const { message, name } = err;
    console.log({ message, name });
    res.redirect("/");
  }
};

// Create Movie
export const getCreateMovie = (req, res) => {
  res.render("createMovie", { pageTitle: "Create Movie" });
};

export const postCreateMovie = async (req, res) => {
  const {
    body: { title, year, rating, synopsis, genres }
  } = req;

  const genreArray = genres.split(",");

  try {
    await Movie.create(
      { title, year, rating, synopsis, genres: genreArray },
      (err, result) => {
        console.log(result);
      }
    );
    res.redirect("/");
  } catch (err) {
    const { message, name } = err;
    console.log({ message, name });
    res.redirect("/");
  }
};

// Movie Detail
export const movieDetail = async (req, res) => {
  const {
    params: { id }
  } = req;

  try {
    const movie = await Movie.findById(id);
    res.render("movieDetail", { pageTitle: movie.title, movie });
  } catch (err) {
    const { message, name } = err;
    console.log({ message, name });
    res.render("404");
  }
};

// Edit Movie
export const getEditMovie = async (req, res) => {
  const {
    params: { id }
  } = req;

  const movie = await Movie.findById(id);

  res.render("editMovie", { pageTitle: movie.title, movie });
};
export const postEditMovie = async (req, res) => {
  const {
    params: { id },
    body: { title, year, rating, synopsis, genres }
  } = req;

  const genreArray = genres.split(",");

  try {
    const movie = await Movie.findByIdAndUpdate(
      id,
      { title, year, rating, synopsis, genres: genreArray },
      (err, result) => console.log(result)
    );
    res.redirect(`/${movie.id}`);
  } catch (err) {
    const { message, name } = err;
    console.log({ message, name });
    res.redirect("/");
  }
};

// Delete Movie
export const deleteMovie = async (req, res) => {
  const {
    params: { id }
  } = req;

  try {
    await Movie.deleteOne({ _id: id });
    res.redirect("/");
  } catch (err) {
    const { message, name } = err;
    console.log({ message, name });
    res.redirect("/");
  }
};

// Search Movie
export const searchMovie = async (req, res) => {
  const { year, rating } = req.query;

  let movies;
  let pageTitle;

  if (year) {
    pageTitle = "year";
    movies = await Movie.find({ year: { $gte: year } });
  } else if (rating) {
    pageTitle = "rating";
    movies = await Movie.find({ rating: { $gte: rating } });
  }

  res.render("searchMovie", { pageTitle, movies });
};
