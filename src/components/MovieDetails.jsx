const MovieDetails = ({ movie, onBack }) => {
  return (
    <div className="text-white px-4 py-6">
      <button
        onClick={onBack}
        className="p-2 my-3 bg-gray-800 cursor-pointer text-white rounded disabled:opacity-50"
      >
        ← Back to Movies
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded shadow-lg "
        />
        <div>
          <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
          <p className="text-gray-400 mb-4">{movie.tagline}</p>
          <p className="mb-2"><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
          <p><strong>Vote Count:</strong> {movie.vote_count}</p>
          <p><strong>Language:</strong> {movie.original_language}</p>

        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
