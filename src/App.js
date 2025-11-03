import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'disneyMovies';
const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

function App() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [rank, setRank] = useState('');
    const [score, setScore] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedMovies = localStorage.getItem(STORAGE_KEY);
        if (storedMovies) {
            const parsedMovies = JSON.parse(storedMovies);
            setMovies(parsedMovies);
            // Fetch posters for movies that don't have them in the background
            parsedMovies.forEach(async (movie, index) => {
                if (!movie.poster) {
                    try {
                        const poster = await fetchPoster(movie.title);
                        if (poster) {
                            setMovies(prevMovies => {
                                const updated = [...prevMovies];
                                updated[index] = { ...updated[index], poster };
                                return updated;
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching poster for', movie.title, error);
                    }
                }
            });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    }, [movies]);

    const fetchPoster = async (movieTitle, movieYear = null) => {
        try {
            let url = `http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${OMDB_API_KEY}`;
            if (movieYear) {
                url += `&y=${movieYear}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            return data.Poster !== 'N/A' ? data.Poster : null;
        } catch (error) {
            console.error('Error fetching poster:', error);
            return null;
        }
    };

    const addMovie = async () => {
        if (!title.trim() || !rank || !score) return;
        const newRank = parseInt(rank);
        const newScore = parseInt(score);
        const newYear = year ? parseInt(year) : null;
        if (newRank < 1 || newScore < 1 || newScore > 10) return;

        setLoading(true);
        const poster = await fetchPoster(title.trim(), newYear);
        setLoading(false);

        const newMovie = {
            title: title.trim(),
            year: newYear,
            rank: newRank,
            score: newScore,
            poster
        };

        // Insert the new movie at the correct rank position and adjust subsequent ranks
        const updatedMovies = [...movies];
        // Find the insertion index based on the desired rank
        const insertIndex = updatedMovies.findIndex(movie => movie.rank >= newRank);

        if (insertIndex === -1) {
            // Add at the end if no movie has a higher or equal rank
            updatedMovies.push(newMovie);
        } else {
            // Insert at the found position
            updatedMovies.splice(insertIndex, 0, newMovie);
        }

        // Adjust ranks for all movies after the insertion point
        for (let i = 0; i < updatedMovies.length; i++) {
            updatedMovies[i].rank = i + 1;
        }

        setMovies(updatedMovies);
        setTitle('');
        setYear('');
        setRank('');
        setScore('');
    };

    const deleteMovie = (index) => {
        const updatedMovies = movies.filter((_, i) => i !== index);
        // Re-rank all remaining movies
        for (let i = 0; i < updatedMovies.length; i++) {
            updatedMovies[i].rank = i + 1;
        }
        setMovies(updatedMovies);
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '100%',
            width: '100vw',
            margin: '0',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            minHeight: '100vh',
            boxSizing: 'border-box'
        }}>
            <h1 style={{
                textAlign: 'center',
                color: '#333',
                fontSize: '24px',
                marginBottom: '20px'
            }}>🎬 Disney Movie Ranker</h1>

            <div style={{
                marginBottom: '20px',
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <input
                    type="text"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }}
                />
                <input
                    type="number"
                    placeholder="Year (optional)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min="1900"
                    max="2030"
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }}
                />
                <input
                    type="number"
                    placeholder="Rank (1-n)"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    min="1"
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }}
                />
                <input
                    type="number"
                    placeholder="Score (1-10)"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    min="1"
                    max="10"
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '15px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }}
                />
                <button
                    onClick={addMovie}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: loading ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Fetching Poster...' : '+ Add Movie'}
                </button>
            </div>

            <div>
                <h2 style={{
                    color: '#333',
                    fontSize: '20px',
                    marginBottom: '15px'
                }}>Your Ranked Movies</h2>
                {movies.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        color: '#666',
                        fontSize: '16px'
                    }}>No movies added yet.</p>
                ) : (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                    }}>
                        {movies.map((movie, index) => (
                            <li
                                key={index}
                                style={{
                                    backgroundColor: 'white',
                                    marginBottom: '10px',
                                    padding: '15px',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <div
                                    style={{
                                        width: '60px',
                                        height: '90px',
                                        borderRadius: '4px',
                                        marginRight: '15px',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: movie.poster ? 'transparent' : '#f0f0f0',
                                        border: movie.poster ? 'none' : '2px dashed #ccc'
                                    }}
                                >
                                    {movie.poster ? (
                                        <img
                                            src={movie.poster}
                                            alt={`${movie.title} poster`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    ) : (
                                        <span style={{
                                            fontSize: '24px',
                                            color: '#999'
                                        }}>
                                            🖼️
                                        </span>
                                    )}
                                </div>
                                <div style={{
                                    flex: '1',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    minWidth: '0'
                                }}>
                                    <span style={{
                                        fontSize: '16px',
                                        wordBreak: 'break-word',
                                        marginRight: '10px'
                                    }}>
                                        {movie.rank}. {movie.title}{movie.year ? ` (${movie.year})` : ''} — {movie.score}/10
                                    </span>
                                    <button
                                        onClick={() => deleteMovie(index)}
                                        style={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '10px 15px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            minWidth: '80px',
                                            flexShrink: 0
                                        }}
                                    >
                                        ❌ Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;