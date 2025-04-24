import React, { useState, useEffect, useCallback } from 'react';
import questions from '../../data/questions.json';
import UserOptions from '../UserOptions/UserOptions.jsx';
import { CategorySelect } from '../CategorySelect/file.js';
import { FinalResult } from '../FinalResult/file.js';
import { useTheme } from "../../ThemeProvider.jsx";

export function QuizGame() {
    const [userName, setUserName] = useState('');
    const [isTimed, setIsTimed] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [timer, setTimer] = useState(10);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const { theme, toggleTheme } = useTheme();


//Acum ar trebuie să meargă corect, cel puțin sper
    useEffect(() => {
        localStorage.setItem('userName', userName);
        localStorage.setItem('isTimed', isTimed);
        localStorage.setItem('isRandom', isRandom);
        localStorage.setItem('category', category);
        localStorage.setItem('difficulty', difficulty);
    }, [userName, isTimed, isRandom, category, difficulty]);


    const filteredQuestions = questions.filter(
        q => q.category === category &&
            (difficulty === '' || q.difficulty === difficulty)
    );

    const startQuiz = useCallback(() => {
        if (!userName || !category) {
            alert('Please enter your name and select a category!');
            return;
        }

        const list = isRandom ? [...filteredQuestions].sort(() => Math.random() - 0.5) : filteredQuestions;

        setQuizQuestions(list);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption('');
        setIsAnswerCorrect(null);
        setTimer(10);
        setIsQuizStarted(true);
        setIsQuizFinished(false);
    }, [userName, category, difficulty, filteredQuestions, isRandom]);

    useEffect(() => {
        let timerInterval = null;

        if (isTimed && isQuizStarted && timer > 0) {
            timerInterval = setTimeout(() => {setTimer((prevTimer) => prevTimer - 1);}, 1000);
        } else if (timer === 0 && isTimed && isQuizStarted) {
            alert('Time’s up! The correct answer is: ' + (quizQuestions[currentQuestionIndex]?.correctAnswer));
            handleNextQuestion();
        }

        return () => clearTimeout(timerInterval);
    }, [timer, isTimed, isQuizStarted, currentQuestionIndex, quizQuestions]);

    const handleAnswerSelection = useCallback(
        option => {
            setSelectedOption(option);
            if (option === quizQuestions[currentQuestionIndex]?.correctAnswer) {
                setIsAnswerCorrect(true);
                setScore(score => score + 1);
            } else {setIsAnswerCorrect(false);}
        }, [currentQuestionIndex, quizQuestions]
    );

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(index => index + 1);
            setSelectedOption('');
            setIsAnswerCorrect(null);
            setTimer(10);
        } else {
            setIsQuizFinished(true);
            setIsQuizStarted(false);
        }
    }, [currentQuestionIndex, quizQuestions.length]);

    const restartQuiz = useCallback(() => {
        setIsQuizStarted(false);
        setIsQuizFinished(false);
        setQuizQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimer(10);
        setSelectedOption('');
        setIsAnswerCorrect(null);
    }, []);

    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
        <div className={theme}>
            <button className="theme" onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </button>

            {!isQuizStarted && !isQuizFinished && (
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
            )}

            {isQuizStarted && !isQuizFinished && (
                <div>
                    <h1>Quiz Game</h1>
                    <h2>Hello, {userName}</h2>
                    {isTimed && <h3>Time remaining: {timer}s</h3>}
                    {currentQuestion ? (
                        <>
                            <p>{currentQuestion.question}</p>
                            <div>
                                {currentQuestion.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswerSelection(opt)}
                                        disabled={!!selectedOption || (isTimed && timer === 0)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            {isAnswerCorrect !== null && (
                                <div>
                                    {isAnswerCorrect ? (
                                        <p>Correct Answer!</p>
                                    ) : (
                                        <p>Wrong! Correct answer: {currentQuestion.correctAnswer}</p>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={handleNextQuestion}
                                disabled={!selectedOption && !(isTimed && timer === 0)}
                            >
                                Next Question
                            </button>
                        </>
                    ) : (
                        <p>No questions available for the selected category/difficulty.</p>
                    )}
                </div>
            )}

            {isQuizFinished && (
                <FinalResult
                    score={score}
                    totalQuestions={quizQuestions.length}
                    restartQuiz={restartQuiz}
                    username={userName}
                    category={category}
                />
            )}
        </div>
    );
}
