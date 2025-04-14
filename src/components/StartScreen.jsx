import { useState } from "react";
import { Award, Clock, Brain, ArrowRight, ChevronLeft, CircleDollarSign } from "lucide-react";
import {  useNavigate } from "react-router-dom";

const StartScreen = () => {
  const [coins, setCoins] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  // Function to animate coin collection
  const questionPage = () => { 
    navigate("/question");
  };

  // Custom coin component
  const CoinIcon = ({ className }) => (
    <div className={`${className} relative flex items-center justify-center`}>
      <CircleDollarSign className="text-yellow-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">Sentence Construction</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <CircleDollarSign className="h-6 w-6 text-yellow-300" />
              {isAnimating && (
                <span className="absolute top-0 right-0 h-full w-full animate-ping rounded-full bg-yellow-300 opacity-50"></span>
              )}
            </div>
            <span className="font-bold">{coins}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col items-center space-y-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <Brain className="h-10 w-10 text-indigo-600" />
          </div>
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">Sentence Construction</h2>
            <p className="text-gray-600">
              Select the correct words to complete the sentence by arranging 
              the provided options in the right order.
            </p>
          </div>
          
          {/* Game Info Cards */}
          <div className="grid grid-cols-3 w-full gap-4">
            <div className="bg-indigo-50 p-4 rounded-xl text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <h3 className="text-xs text-gray-600">Time Per Question</h3>
              <p className="font-bold text-gray-800">30 sec</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-xl text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <h3 className="text-xs text-gray-600">Total Questions</h3>
              <p className="font-bold text-gray-800">10</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-xl text-center">
              <CircleDollarSign className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <h3 className="text-xs text-gray-600">Coins</h3>
              <p className="font-bold text-gray-800">{coins}</p>
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="p-6 flex justify-between gap-4">
          <button 
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
          
          <button 
            onClick={questionPage}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Start
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;