const movieGrid = document.getElementById("movieGrid");
const searchForm = document.getElementById("search__form");
const searchInput = document.getElementById("search__input");

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

// fetching trending movies
async function fetchTrendingMovies() {
  spinner.classList.remove("hidden");

  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}` //calls tmdb's trending today endpoint, parses the json and sends results to displayMovies()
    );
    const data = await response.json();
    await new Promise((resolve) => setTimeout(resolve, 500));

    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  } finally {
    spinner.classList.add("hidden");
  }
}

// display movie cards
//clears olld grid, loops through movies, creates new card, adds poster, title, date and rating
//adds card to grid
function displayMovies(movies) {
  movieGrid.innerHTML = "";

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie__card");
    card.innerHTML = `<img src="${
      movie.poster_path ? IMG_BASE_URL + movie.poster_path : "fallback.jpg"
    }" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p> ⭐ ${movie.vote_average} | ${movie.release_date}</p>`;

    card.addEventListener("click", () => {
      fetchMovieDetails(movie.id);
    });

    card.addEventListener('click', () => {
        showMovieModal(movie)
    })
    movieGrid.appendChild(card);
  });
}

//movie details
async function fetchMovieDetails(movieId) {
  try {
    spinner.classList.remove("hidden");

    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );
    const movie = await response.json();

    spinner.classList.add("hidden");
    console.log("movie details", movie);
    showMovieModal(movie);
  } catch (error) {
    console.error("failed to fetch more movie details:", error);
    spinner.classList.add("hidden");
  }
}

// search
//listens for search from submit-grabbs typed data
//sends search request to tmdb-displays movies
searchForm.addEventListener("submit", async (event) => {
  spinner.classList.remove("hidden");

  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );

    const data = await response.json();
    displayMovies(data.results);
    spinner.classList.add("hidden");
  }
});

// trending
//runs on page load to auto show trending movies on load
document.addEventListener("DOMContentLoaded", fetchTrendingMovies);

//spinner
const spinner = document.getElementById("loading__spinner");
spinner.classList.remove("hidden");
spinner.classList.add("hidden");

// movie modal

function showMovieModal(movie) {
    if (!movie || !movie.title){
        console.warn('Invalid movie data for modal:', movie);
        return;
    }
  const modal = document.getElementById("movie__modal");
  const modalDetails = document.getElementById("modal__details");
  const closeModal = document.getElementById("close__modal");

  modalDetails.innerHTML = `<h2>${movie.title} </h2>
    <p><strong>Overview:</strong> ${movie.overview} </p> 
    <p><strong>Release Date:</strong> ${movie.release_date} </p>
    <p><strong>Rating:</strong> ${movie.vote_average} </p>`;

  modal.classList.remove("hidden");

  closeModal.onclick = () => modal.classList.add('hidden');
  window.onclick = (e) => {
    if (e.target === modal) modal.classList.add('hidden')
  }

//   closeModal.addEventListener('click', () => {
//     modal.classList.add('hidden');
//   })

//  window.addEventListener('click', (e) => {
//     if (e.target === modal) {
//         modal.classList.add('hidden');
//     }
//  })
  console.log("modal works");
}
