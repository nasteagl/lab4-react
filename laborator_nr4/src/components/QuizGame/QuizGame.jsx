import React, { useState, useEffect, useCallback } from 'react';
import questions from '../../data/questions.json';
import UserOptions from '../UserOptions/UserOptions.jsx';
import {CategorySelect} from '../CategorySelect/file.js';
import { FinalResult } from '../FinalResult/file.js';
import { useTheme } from "../../ThemeProvider.jsx";

export function QuizGame() {
    const [userName, setUserName] = useState('');
    const [isTimed, setIsTimed] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [timer, setTimer] = useState(10);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const filteredQuestions = questions.filter(
        q => q.category === category && (difficulty === '' || q.difficulty === difficulty)
    );

    const questionsToUse = isRandom ? filteredQuestions.sort(() => Math.random() - 0.5) : filteredQuestions;
    const currentQuestion = questionsToUse[currentQuestionIndex];

    useEffect(() => {
        if (isTimed && timer > 0 && isQuizStarted) {
            const intervalId = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else if (timer === 0) {
            alert('Time’s up! The correct answer is: ' + (currentQuestion ? currentQuestion.correctAnswer : 'N/A'));
            handleNextQuestion();
        }
    }, [timer, isTimed, isQuizStarted, currentQuestion]);

    const startQuiz = useCallback(() => {
        if (!userName || !category) {
            alert('Please enter your name and select a category!');
            return;
        }
        setIsQuizStarted(true);
        setTimer(10);
    }, [userName, category]);

    const handleAnswerSelection = useCallback((option) => {
        setSelectedOption(option);
        if (option === currentQuestion.correctAnswer) {
            setIsAnswerCorrect(true);
            setScore(prevScore => prevScore + 1);
        } else {
            setIsAnswerCorrect(false);
        }
    }, [currentQuestion]);

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questionsToUse.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption('');
            setIsAnswerCorrect(null);
            setTimer(10);
        } else {
            setIsQuizStarted(false);
            setIsQuizFinished(true);
        }
    }, [currentQuestionIndex, questionsToUse.length]);

    const restartQuiz = useCallback(() => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsQuizStarted(false);
        setIsQuizFinished(false);
        setTimer(10);
        setSelectedOption('');
        setIsAnswerCorrect(null);
    }, []);

    return (
        <div className={theme}>
            <button className="theme" onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </button>

            {!isQuizStarted && !isQuizFinished ? (
                <div>
                    <UserOptions
                        userName={userName}
                        setUserName={setUserName}
                        isTimed={isTimed}
                        setIsTimed={setIsTimed}
                        isRandom={isRandom}
                        setIsRandom={setIsRandom}
                        difficulty={difficulty}
                        setDifficulty={setDifficulty}
                    />
                    <CategorySelect
                        categories={['Matematică', 'Istorie', 'Geografie', 'Biologie']}
                        selectedCategory={category}
                        setSelectedCategory={setCategory}
                    />
                    <button onClick={startQuiz}>Start Quiz</button>
                </div>
            ) : (
                <div>
                    <h1>Quiz Game</h1>
                    <h2>Hello, {userName}</h2>
                    {isTimed && <h3>Time remaining: {timer}s</h3>}
                    <div>
                        {currentQuestion ? (
                            <>
                                <p>{currentQuestion.question}</p>
                                <div>
                                    {currentQuestion.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelection(option)}
                                            disabled={selectedOption}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                {isAnswerCorrect !== null && (
                                    <div>
                                        {isAnswerCorrect ? (
                                            <p>Correct Answer!</p>
                                        ) : (
                                            <p>Wrong Answer! The correct answer is: {currentQuestion.correctAnswer}</p>
                                        )}
                                    </div>
                                )}
                                <button onClick={handleNextQuestion} disabled={selectedOption === ''}>
                                    Next Question
                                </button>
                            </>
                        ) : (
                            <p>No questions available for the selected category and difficulty.</p>
                        )}
                    </div>
                </div>
            )}
            {isQuizFinished && <FinalResult
                score={score}
                totalQuestions={questionsToUse.length}
                restartQuiz={restartQuiz}
                username={userName}
                category={category}
            />}
        </div>
    );
}
