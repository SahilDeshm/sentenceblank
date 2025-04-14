import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft, Award, Home } from 'lucide-react';

function ResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const allAnswers = location.state?.allAnswers || [];
  const [expanded, setExpanded] = useState(null);

  const correctCount = allAnswers.filter((item) => item.isCorrect).length;
  const score = Math.round((correctCount / allAnswers.length) * 100);

  // Determine score color and message
  const getScoreInfo = () => {
    if (score >= 90) return { color: 'text-emerald-500', message: 'Excellent work!' };
    if (score >= 70) return { color: 'text-green-500', message: 'Good job!' };
    if (score >= 50) return { color: 'text-yellow-500', message: 'You\'re making progress!' };
    return { color: 'text-red-500', message: 'Keep practicing!' };
  };

  const { color, message } = getScoreInfo();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 flex flex-col items-center">
      {/* Score Card */}
      <motion.div 
        className="bg-white border rounded-xl shadow-lg w-full max-w-xl p-8 text-center mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="relative">
            <motion.div 
              className="w-36 h-36 rounded-full flex items-center justify-center border-8 border-gray-100"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span 
                className={`text-5xl font-bold ${color}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {score}%
              </motion.span>
            </motion.div>
            <motion.div 
              className="absolute -top-2 -right-2 bg-blue-100 rounded-full p-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Award className="w-6 h-6 text-blue-600" />
            </motion.div>
          </div>
        </div>
        
        <motion.h3 
          className={`text-xl font-bold ${color} mb-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {message}
        </motion.h3>
        
        <motion.p 
          className="text-gray-700 font-medium mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {correctCount} out of {allAnswers.length} correct
        </motion.p>
        
        <motion.p 
          className="text-gray-500 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          While you correctly formed several sentences, there are a couple of areas where improvement is needed. 
          Pay close attention to sentence structure and word placement to ensure clarity and correctness.
        </motion.p>
        
        <div className="flex justify-center gap-4">
          <motion.button
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
          
          <motion.button
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </motion.button>
        </div>
      </motion.div>

      {/* Detailed Answers */}
      <motion.div 
        className="w-full max-w-2xl space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {allAnswers.map((item, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`p-6 rounded-xl shadow-md border ${
              item.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
            } transition-all duration-300 cursor-pointer`}
            onClick={() => setExpanded(expanded === index ? null : index)}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 mb-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded">Prompt</span>{' '}
                <span className="text-gray-700 font-medium ml-2">
                  {index + 1}/{allAnswers.length}
                </span>
              </div>
              
              <div className="flex items-center">
                {item.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>

            <p className="text-gray-800 font-medium mb-4">{item.question}</p>

            <div className="mb-2">
              <p className="text-sm font-semibold text-gray-600">
                Your response
              </p>
              <p className="mt-1 text-gray-800 font-medium">
                {item.userAnswer.join(' ')}
              </p>
            </div>

            {(!item.isCorrect || expanded === index) && (
              <motion.div 
                className="mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-semibold text-gray-600">Correct response</p>
                <p className="mt-1 text-gray-800 font-medium">{item.correctAnswer.join(' ')}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default ResultScreen;