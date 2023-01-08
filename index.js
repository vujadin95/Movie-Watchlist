const inputSearch = document.getElementById("input-search");
const searchBtn = document.getElementById("search-btn");
const movieContainer = document.getElementById("movie-container");
const watchlistContainer = document.getElementById("watchlist-container");

//

function findMovie() {
  htmlString = "";
  getMovieId();
}

async function getMovieId() {
  // check if input field is empty
  if (inputSearch.value) {
    // get searched movie title and imdbID
    const result = await fetch(
      `http://www.omdbapi.com/?s=${inputSearch.value}&type=movie&apikey=215e1087`
    );
    const data = await result.json();
    console.log(data);

    // check if movie exists in returned fetch respond
    if (data.Response === "True") {
      // get short description for movies to display movie characteristics
      data.Search.map(async (movie) => {
        const response = await fetch(
          `http://www.omdbapi.com/?i=${movie.imdbID}&type=movie&plot=short&apikey=215e1087`
        );
        const data = await response.json();
        console.log(data);
        // call renderMovie function to display searched movies
        renderMovies(data);
      });
    } else {
      // if searched movie doesn't exist, display message
      movieContainer.textContent = `Unable to find what you're looking for. Please try another search.`;
    }
  }
}

function renderMovies(data) {
  // check if all movie characteristic are valid
  if (
    data.Poster !== "N/A" &&
    data.Title !== "N/A" &&
    data.imdbRating !== "N/A" &&
    data.Runtime !== "N/A" &&
    data.Genre !== "N/A" &&
    data.imdbID !== "N/A" &&
    data.Plot !== "N/A"
  ) {
    htmlString += `
    <section class='movie-container'>
      <img class='poster' src='${data.Poster}' alt='Blade Runner movie poster'>
      <div class='movie-desc'>
        <h2 class='movie-title'>${data.Title}<i class="fa fa-star"></i><span class='imdb-rating'>${data.imdbRating}</span></h2>
        <div class='movie-char'>
          <p>${data.Runtime}</p>
          <p>${data.Genre}</p>
          <a id='${data.imdbID}' href='#' class='watchlist'><span class="fa fa-plus plus-style"></span>Watchlist</a>
        </div>
        <p class='movie-plot'>${data.Plot}<p>
      </div>
    </section>
    `;
  }
  // remove styling from opening text, before displaying movies with new styling
  movieContainer.classList.remove("app-start");
  movieContainer.innerHTML = htmlString;
}

// check if index.html page is active
if (searchBtn) {
  searchBtn.addEventListener("click", findMovie);
}

// check if index.html page is active
if (movieContainer) {
  movieContainer.addEventListener("click", (e) => {
    let movieId = e.target.id;
    if (movieId.includes("tt")) {
      getMovieForWatchlist(movieId);
    }
  });
}

async function getMovieForWatchlist(movieId) {
  const result = await fetch(
    `http://www.omdbapi.com/?i=${movieId}&type=movie&plot=short&apikey=215e1087`
  );
  const data = await result.json();
  addMovieToWatchlist(data);
}

function addMovieToWatchlist(data) {
  if (localStorage.getItem("movieWatchlist") == null) {
    localStorage.setItem("movieWatchlist", JSON.stringify([]));
  }
  let movieList = JSON.parse(localStorage.getItem("movieWatchlist"));
  movieList.push(data);
  localStorage.setItem("movieWatchlist", JSON.stringify(movieList));
}

// watchlist functionality
let watchlistHtml = "";

// check if watchlist.html page is active
if (watchlistContainer) {
  getWatchlistFromLocalStorage();
  removeFromWatchlist();
}

function renderWatchList(watchlist) {
  watchlistHtml += `
    <section class='movie-container'>
      <img class='poster' src='${watchlist.Poster}' alt='Blade Runner movie poster'>
      <div class='movie-desc'>
        <h2 class='movie-title'>${watchlist.Title}<i class="fa fa-star"></i><span class='imdb-rating'>${watchlist.imdbRating}</span></h2>
        <div class='movie-char'>
          <p>${watchlist.Runtime}</p>
          <p>${watchlist.Genre}</p>
          <a id='${watchlist.imdbID}' href='#' class='watchlist'><span class="fa fa-minus plus-style"></span>Remove</a>
        </div>
        <p class='movie-plot'>${watchlist.Plot}<p>
      </div>
    </section>
    `;
  watchlistContainer.innerHTML = watchlistHtml;
  watchlistContainer.classList.remove(
    "watchlist-container",
    "watchlist-comment",
    "add-more-movies"
  );
}

function getWatchlistFromLocalStorage() {
  let renderArr = JSON.parse(localStorage.getItem("movieWatchlist"));
  if (renderArr.length > 0) {
    renderArr.map((movie) => {
      renderWatchList(movie);
    });
  }
}

function removeFromWatchlist() {
  watchlistContainer.addEventListener("click", (e) => {
    location.reload();
    let movieIDToRemove = e.target.id;
    if (movieIDToRemove) {
      let renderArr = JSON.parse(localStorage.getItem("movieWatchlist"));
      let filteredrenderArr = renderArr.filter((movie) => {
        return movie.imdbID !== movieIDToRemove;
      });
      console.log(filteredrenderArr);
      localStorage.setItem("movieWatchlist", JSON.stringify(filteredrenderArr));
      // getWatchlistFromLocalStorage();
    }
  });
}
