import React, { useEffect, useState } from 'react';

export function FinalResult({ score, totalQuestions, restartQuiz, username, category }) {
    const [bestScore, setBestScore] = useState(null);
    const [allScores, setAllScores] = useState([]);

    useEffect(() => {
        if (!username || !category) return;

        const storageKey = `bestScore_${username}_${category}`;



        const storedScore = localStorage.getItem(storageKey);
        const previousBest = storedScore ? parseInt(storedScore, 10) : null;

        if (previousBest === null || score > previousBest) {
            localStorage.setItem(storageKey, score.toString());
            setBestScore(score);
        } else {
            setBestScore(previousBest);
        }

        const scores = Object.keys(localStorage)
            .filter(key => key.startsWith("bestScore_"))
            .map(key => {
                const [_, user, cat] = key.split("_");
                return {
                    user,
                    category: category,
                    score: parseInt(localStorage.getItem(key), 10)
                };
            });

        setAllScores(scores);
    }, [score, username, category]);

    return (
        <div className="result-container">
            <h2>Quiz Finished!</h2>

            <p>Your final score in <strong>{category}</strong> is <strong>{score}</strong> out of <strong>{totalQuestions}</strong>.</p>
            {bestScore !== null && (
                <p>Your best score in <strong>{category}</strong> is: <strong>{bestScore}</strong>.</p>
            )}

            <h3>Best Scores from All Users</h3>
            <ul>
                {allScores.map((entry, index) => (
                    <ul key={index}>
                        <strong>{entry.user}</strong> - {entry.category}: {entry.score}
                    </ul>
                ))}
            </ul>

            <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
    );
}
