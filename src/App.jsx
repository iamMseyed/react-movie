import { useState, useEffect } from 'react';
import { Search } from './components/Search.jsx';
import './index.css';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
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
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch,setDebouncedSearch] = useState('');

  useDebounce( () => setDebouncedSearch(searchTerm), 500,[searchTerm])

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const queryTrim = query.trim();
      const endpoint = queryTrim
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(queryTrim)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Error fetching movies!');
      }
      const data = await response.json();
      setMovieList(data.results || []);
    } catch (error) {
      setErrorMessage(error.message || 'Error occurred!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">movies</span> you'll enjoy
              without any hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies">
            <h2 className='mt-[40px]'>All Movies</h2>

            {isLoading ? (
              // <p className="text-white">Loading...</p>
              <Spinner/>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                 <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default App;