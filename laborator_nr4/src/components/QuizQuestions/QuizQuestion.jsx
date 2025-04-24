import React, {useCallback} from 'react';


const QuizQuestion=React.memo(({ question, answers, onAnswerSelect })=> {

    const handleAnswerSelectAswer = useCallback((answers) => {
        onAnswerSelect(answers);

    }, [onAnswerSelect]);


    return (
        <div className="quiz-question">
            <h2 className="question-text">{question}</h2>
            <div className="answers-container">
                {answers.map((answer, index) => (
                    <button
                        key={index}
                        className="answer-button"
                        onClick={() => onAnswerSelect(answer)}
                    >
                        {answer}
                    </button>
                ))}
            </div>
        </div>
    );
});


