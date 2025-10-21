import { useState, useEffect } from 'react';
import { Search } from './components/Search.jsx';
import './index.css';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null); 

  useDebounce(() => {
    setDebouncedSearch(searchTerm);
  }, 500, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchMovies(debouncedSearch, page);
  }, [debouncedSearch, page]);

  const fetchMovies = async (query, page = 1) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const queryTrim = query.trim();
      const endpoint = queryTrim
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(queryTrim)}&page=${page}`
        : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Error fetching movies!');
      }

      const data = await response.json();

      setMovieList(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      setErrorMessage(error.message || 'Error occurred!');
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">movies</span> you'll enjoy
            without any hassle
          </h1>
          {!selectedMovie && (
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )}
        </header>

        <section className="all-movies">
          {selectedMovie ? (
            <MovieDetails movie={selectedMovie} onBack={() => setSelectedMovie(null)} />
          ) : isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <>
              <h2 className="mt-[40px]">All Movies</h2>
              <ul className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)} 
                  />
                ))}
              </ul>

              {movieList.length > 0 && (
                <div className="mt-6 px-2">
                  <div className="flex justify-end gap-4 items-center">
                    <button
                      className="px-4 py-2 bg-gray-800 cursor-pointer text-white rounded disabled:opacity-50"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                     ← Back                      
                    </button>
                    <span className="text-white">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className="px-4 py-2 bg-gray-800 cursor-pointer text-white rounded disabled:opacity-50"
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;