const APIURL = "https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=";
const PAGE_SIZE = 20; // Set the number of movies per page
// Get the current year
const currentYear = new Date().getFullYear();

// Update the footer year
document.getElementById('year').textContent = currentYear;

const form = document.getElementById("form");
const search = document.getElementById("search");
const content = document.getElementById("content");
const pagination = document.getElementById("pagination");

let currentPage = 1;

getMovies(APIURL);

async function getMovies(url) {
    try {
        let res = await fetch(url);
        let data = await res.json();
        console.log(data);
        showMovies(data.results);
        showPagination(data.total_pages);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function showMovies(movies) {
    const fragment = document.createDocumentFragment();
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentMovies = movies.slice(startIndex, endIndex);

    currentMovies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.className = 'movie';

        const img = document.createElement('img');
        img.className = 'movie-img';
        img.alt = movie.title;

        // Check if the movie has a poster path
        if (movie.poster_path) {
            img.src = `${IMGPATH}${movie.poster_path}`;
        } else {
            // Use a placeholder image (avatar) if no poster path is available
            img.src = 'no-image-svgrepo-com.svg'; // Replace 'path/to/avatar.jpg' with the actual path to your placeholder image
        }

        const title = document.createElement('h2');
        title.className = 'movie-title';
        title.textContent = movie.title;

        const vote = document.createElement('p');
        vote.className = 'movie-vote';
        vote.textContent = movie.vote_average;

        const overview = document.createElement('p');
        overview.className = 'movie-overview';
        overview.textContent = movie.overview;

        movieEl.appendChild(img);
        movieEl.appendChild(title);
        movieEl.appendChild(vote);
        movieEl.appendChild(overview);

        fragment.appendChild(movieEl);
    });

    // Clear existing content before appending
    content.innerHTML = "";
    content.appendChild(fragment);
}


function showPagination(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const maxVisiblePages = 5;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
    const startPage = Math.max(1, currentPage - halfMaxVisiblePages);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Add ellipsis at the beginning if necessary
    if (startPage > 1) {
        const ellipsisStart = document.createElement("span");
        ellipsisStart.textContent = "...";
        paginationContainer.appendChild(ellipsisStart);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement("span");
        pageItem.className = "page-item";
        pageItem.textContent = i;
        pageItem.addEventListener("click", () => {
            currentPage = i;
            getMovies(`${APIURL}&page=${currentPage}`);
        });

        if (i === currentPage) {
            pageItem.classList.add("active");
        }

        paginationContainer.appendChild(pageItem);
    }

    // Add ellipsis at the end if necessary
    if (endPage < totalPages) {
        const ellipsisEnd = document.createElement("span");
        ellipsisEnd.textContent = "...";
        paginationContainer.appendChild(ellipsisEnd);
    }
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if (searchTerm) {
        await getMovies(`${SEARCHAPI}${searchTerm}`);
    }
});
