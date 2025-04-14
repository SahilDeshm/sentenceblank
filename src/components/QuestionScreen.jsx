import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function QuestionScreen() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://sentenceblank-3.onrender.com');
        const data = await response.json();
        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !loading && questions.length > 0) {
      handleNextQuestion();
    }
  }, [timeLeft, loading]);

  // Reset timer and answers on question change
  useEffect(() => {
    setTimeLeft(30);
    const blanksCount = questions[currentQuestionIndex]?.question.split("_____________").length - 1 || 0;
    setSelectedAnswers(Array(blanksCount).fill(null));
  }, [currentQuestionIndex, questions]);


  const handleSelectWord = (word, index) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = word;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleRemoveWord = (index) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = null;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return;

    const blanksCount = currentQuestion.question.split('_____________').length - 1;
    const paddedAnswers = Array.from({ length: blanksCount }, (_, i) => selectedAnswers[i] || null);
    const isCorrect = JSON.stringify(paddedAnswers) === JSON.stringify(currentQuestion.correctAnswer);

    setAllAnswers([...allAnswers, {
      question: currentQuestion.question,
      userAnswer: paddedAnswers,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {

      navigate('/result', {
        state: { allAnswers }
      });
      
      // TODO: Show results screen
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const questionParts = currentQuestion.question.split('_____________');

  const allBlanksFilled =
    selectedAnswers.length === questionParts.length - 1 &&
    !selectedAnswers.includes(null) &&
    !selectedAnswers.includes(undefined);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">{`${timeLeft}s`}</div>
          <button className="text-gray-500 hover:text-gray-700">Quit</button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <h2 className="text-center text-gray-600 mb-6">
          Select the missing words in the correct order
        </h2>

        {/* Display Question with blanks */}
        <div className="text-xl text-center mb-6">
          {questionParts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < questionParts.length - 1 && (
                <button
                  onClick={() => handleRemoveWord(index)}
                  className={`mx-2 px-3 py-1 min-w-[120px] border-b-2 ${selectedAnswers[index]
                    ? 'bg-blue-100 border-blue-500'
                    : 'border-gray-300'
                    }`}
                >
                  {selectedAnswers[index] || ""}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Word options */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                const nextEmptyIndex = selectedAnswers.findIndex(ans => !ans);
                if (nextEmptyIndex !== -1 && !selectedAnswers.includes(option)) {
                  handleSelectWord(option, nextEmptyIndex);
                }
              }}
              disabled={selectedAnswers.includes(option)}
              className={`px-4 py-2 rounded border ${selectedAnswers.includes(option)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100'
                }`}
            >
              {option}
            </button>
          ))}


        </div>

        {/* Next button */}
        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={!allBlanksFilled}
            className={`px-4 py-2 rounded ${allBlanksFilled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
