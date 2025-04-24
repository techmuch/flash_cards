import React from 'react';
import QuizArea from './QuizArea'; // QuizArea handles the card display and next/flip logic

function QuizView({ preparedQuizItems, quizMode, onQuitQuiz }) {
    return (
        <div className="quiz-view">
            {/* QuizArea component handles the card display, next, and flip buttons */}
            <QuizArea quizItems={preparedQuizItems} quizMode={quizMode} />

            {/* Quit Button */}
            <button
                onClick={onQuitQuiz}
                style={{
                    padding: '10px 20px',
                    fontSize: '1em',
                    cursor: 'pointer',
                    marginTop: '30px', /* Add space below quiz area */
                    backgroundColor: '#6c757d', /* Gray color */
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                }}
            >
                Quit Quiz
            </button>
        </div>
    );
}

export default QuizView;