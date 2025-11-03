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
            let url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${OMDB_API_KEY}`;
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
            fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
            maxWidth: '100%',
            width: '100vw',
            margin: '0',
            padding: '20px',
            background: 'linear-gradient(135deg, #e6f3ff 0%, #fce4ec 100%)',
            minHeight: '100vh',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Fairy dust background animation */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '0'
            }}>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: '4px',
                            height: '4px',
                            backgroundColor: 'rgba(255, 215, 0, 0.6)',
                            borderRadius: '50%',
                            animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
                            boxShadow: '0 0 6px rgba(255, 215, 0, 0.8)'
                        }}
                    />
                ))}
            </div>

            <style>
                {`
              @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
              }
            `}
            </style>
            {/* Disney Castle Logo */}
            <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '48px'
            }}>
                🏰
            </div>

            <h1 style={{
                textAlign: 'center',
                color: '#2c3e50',
                fontSize: '28px',
                marginBottom: '30px',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
                fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive'
            }}>Disney Movie Ranker</h1>

            <div style={{
                marginBottom: '30px',
                background: 'linear-gradient(135deg, #f8e8ff 0%, #fce4ec 100%)',
                padding: '20px',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
            }}>
                <input
                    type="text"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px',
                        marginBottom: '12px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '16px',
                        fontSize: '16px',
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        fontStyle: 'italic',
                        fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 3px rgba(255, 248, 88, 0.5)'}
                    onBlur={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)'}
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
                        padding: '15px',
                        marginBottom: '12px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '16px',
                        fontSize: '16px',
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        fontStyle: 'italic',
                        fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 3px rgba(255, 248, 88, 0.5)'}
                    onBlur={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)'}
                />
                <input
                    type="number"
                    placeholder="Rank (1-n)"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    min="1"
                    style={{
                        width: '100%',
                        padding: '15px',
                        marginBottom: '12px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '16px',
                        fontSize: '16px',
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        fontStyle: 'italic',
                        fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 3px rgba(255, 248, 88, 0.5)'}
                    onBlur={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)'}
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
                        padding: '15px',
                        marginBottom: '20px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '16px',
                        fontSize: '16px',
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        fontStyle: 'italic',
                        fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 3px rgba(255, 248, 88, 0.5)'}
                    onBlur={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)'}
                />
                <button
                    onClick={addMovie}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: loading ? '#ccc' : 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                        color: '#2c3e50',
                        border: '3px solid rgba(255, 215, 0, 0.8)',
                        borderRadius: '24px',
                        fontSize: '18px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px rgba(255, 215, 0, 0.4)';
                            e.target.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                            e.target.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    {loading ? '✨ Fetching Poster...' : '✨ + Add Movie'}
                </button>
            </div>

            <div>
                <h2 style={{
                    color: '#2c3e50',
                    fontSize: '24px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                    textShadow: '0 0 8px rgba(255, 215, 0, 0.3)'
                }}>✨ Your Ranked Movies ✨</h2>
                {movies.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        color: '#666',
                        fontSize: '18px',
                        fontStyle: 'italic',
                        fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive'
                    }}>No magical movies added yet... 🏰</p>
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
                                    background: 'linear-gradient(135deg, #e8d5ff 0%, #fce4ec 100%)',
                                    marginBottom: '15px',
                                    padding: '20px',
                                    borderRadius: '24px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2), 0 0 20px rgba(255, 215, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)';
                                }}
                            >
                                <div
                                    style={{
                                        width: '70px',
                                        height: '100px',
                                        borderRadius: '12px',
                                        marginRight: '20px',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: movie.poster ? 'transparent' : 'rgba(255,255,255,0.8)',
                                        border: movie.poster ? 'none' : '3px dashed rgba(255,255,255,0.5)',
                                        boxShadow: movie.poster ? 'none' : 'inset 0 2px 4px rgba(0,0,0,0.1)'
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
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    ) : (
                                        <span style={{
                                            fontSize: '28px',
                                            color: '#999'
                                        }}>
                                            🖼️
                                        </span>
                                    )}
                                </div>
                                <div style={{
                                    flex: '1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minWidth: '0'
                                }}>
                                    <div style={{
                                        fontSize: '18px',
                                        wordBreak: 'break-word',
                                        marginBottom: '8px',
                                        fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                                        color: '#2c3e50',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                        lineHeight: '1.3'
                                    }}>
                                        {movie.rank}. {movie.title}{movie.year ? ` (${movie.year})` : ''}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            fontSize: '16px',
                                            fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                                            color: '#2c3e50',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                            fontWeight: 'bold'
                                        }}>
                                            {movie.score}/10 ⭐
                                        </span>
                                        <button
                                            onClick={() => deleteMovie(index)}
                                            style={{
                                                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                                                color: '#2c3e50',
                                                border: '3px solid rgba(255, 215, 0, 0.8)',
                                                borderRadius: '20px',
                                                padding: '12px 18px',
                                                fontSize: '16px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                minWidth: '90px',
                                                flexShrink: 0,
                                                fontFamily: '"Comic Sans MS", "Chalkduster", fantasy, cursive',
                                                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                                                transition: 'all 0.3s ease',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px rgba(255, 215, 0, 0.4)';
                                                e.target.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
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