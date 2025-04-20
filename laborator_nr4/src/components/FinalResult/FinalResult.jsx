import React, { useEffect, useState } from 'react';

export function FinalResult({ score, totalQuestions, restartQuiz, username, category }) {
    const [bestScore, setBestScore] = useState(null);

    useEffect(() => {

        const key = `bestScore_${username}_${category}`;
        const storedScore = localStorage.getItem(key);
        let previousBest = null;

        if (storedScore !== null) {
            previousBest = parseInt(storedScore);
        }

        if (previousBest === null || score > previousBest) {
            localStorage.setItem(key, score.toString());
            setBestScore(score);
        } else {
            setBestScore(previousBest);
        }
    }, [score, username, category]);

    return (
        <div>
            <h2>Quiz Finished!</h2>
            <p>Your final score in <strong>{category}</strong> is {score} out of {totalQuestions}!</p>
            {bestScore !== null && (
                <p>Your best score in <strong>{category}</strong> is: {bestScore}</p>
            )}
            <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
    );
}
