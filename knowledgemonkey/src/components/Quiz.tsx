import React, { useState, useEffect } from 'react';
import { generatePointsAndRatio, calculatePointC, generateFakeOptions } from '../utils';

// Define the types for the points and options
interface Point {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  xc: number;
  yc: number;
  r1: number;
  r2: number;
  explanationX?: string;
  explanationY?: string;
  fractionalX?: string;
  fractionalY?: string;
}

interface Option {
  xc: string;
  yc: string;
}

interface QuizProps {
  onPointsUpdate: (points: Point) => void;
}

const Quiz: React.FC<QuizProps> = ({ onPointsUpdate }) => {
  // State variables to store points, options, correct answer, explanation, messages, streak, and timer
  const [points, setPoints] = useState<Point>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    xc: 0,
    yc: 0,
    r1: 0,
    r2: 0,
    fractionalX: '',
    fractionalY: '',
  });
  const [options, setOptions] = useState<Option[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<Option>({ xc: '0', yc: '0' });
  const [explanation, setExplanation] = useState<string | null>(null);
  const [correctMessage, setCorrectMessage] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>('easy');

  // Function to change difficulty (resets streak and the time limit)
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDifficulty = e.target.value;
    setDifficulty(selectedDifficulty);
    setStreak(0);
    setTimeLeft(getTimeLimit(selectedDifficulty));
  };

  const getTimeLimit = (selectedDifficulty: string) => {
    switch (selectedDifficulty) {
      case 'hard':
        return 60; // 1 minute for hard
      case 'medium':
        return 120; // 2 minutes for medium
      case 'easy':
      default:
        return 180; // 3 minutes for easy
    }
  };

  const generateQuestion = () => {
    // Generate points and ratios
    const { x1, y1, x2, y2, r1, r2 } = generatePointsAndRatio();
    // Calculate the correct coordinates for point C
    const { xc, yc, explanationX, explanationY, fractionalX, fractionalY } = calculatePointC(x1, y1, x2, y2, r1, r2);

    // Create a new points object with all necessary data
    const newPoints: Point = { x1, y1, x2, y2, xc, yc, r1, r2, explanationX, explanationY, fractionalX, fractionalY };
    setPoints(newPoints);
    // Call the onPointsUpdate callback with the new points
    onPointsUpdate(newPoints);

    // Generate fake options to display as choices
    const fakeOptions = generateFakeOptions(fractionalX, fractionalY);
    // Combine fake options with the correct answer and shuffle them randomly
    const allOptions = [...fakeOptions, { xc: fractionalX, yc: fractionalY }];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
    setCorrectAnswer({ xc: fractionalX, yc: fractionalY });
    setExplanation(null);
    setCorrectMessage(false);
    setTimeLeft(getTimeLimit(difficulty)); // Reset timer based on the difficulty
  };
  // We use 'useEffect' to generate a new question when the component first mounts
  useEffect(() => {
    generateQuestion();
  }, [difficulty]);

  // We use 'useEffect' to handle the countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setStreak(0);
      generateQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Cleanup the timer when the component is unmounted
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Function to handle answer clicks
  const handleAnswerClick = (option: Option) => {
    // Check if the option the user selected is correct
    if (option.xc === correctAnswer.xc && option.yc === correctAnswer.yc) {
      setCorrectMessage(true);
      setStreak(streak + 1);
      // Play a ding sound if the answer is correct
      const audio = new Audio('../../ding.mp3');
      audio.play();      
      // Generate a new question after a short delay
      setTimeout(() => {
        setCorrectMessage(false);
        generateQuestion(); // Only generate a new question on correct answer
      }, 500);
    } else {
      setStreak(0);
      // Set an explanation if the answer is incorrect
      setExplanation(
        `The correct coordinates for point C are (${formatAnswer(correctAnswer.xc)}, ${formatAnswer(correctAnswer.yc)}).
        Calculation steps:
        For x: 
        ${formatExplanation(points.explanationX || 'N/A')}
        For y: 
        ${formatExplanation(points.explanationY || 'N/A')}`
      );
  
      setTimeout(() => {
        setExplanation(null);
      }, 2500); // Wait 2.5 seconds before clearing explanation
    }
  };  
  // Removes the unwanted /1 if last two characters are '/1'
  const formatAnswer = (answer: string) => {
    return answer.endsWith('/1') ? answer.slice(0, -2) : answer;
  };

  // Expression to find all occurrencesof numbers followed by '/1'
  // Replace each occurrence with just the number (removing '/1')
  const formatExplanation = (explanation: string) => {
    return explanation.replace(/(\b[0-9]+)\/1\b/g, '$1');
  };

  // Format time from seconds into Minutes:Seconds format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    // The structure of the page + tailwind styling
    <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4 text-primary">Division Point Quiz</h1>
      <div className="flex flex-col items-center mb-4">
        <p>Time Left: {formatTime(timeLeft)}</p>
        <p>Point A: ({formatAnswer(points.x1.toString())}, {formatAnswer(points.y1.toString())})</p>
        <p>Point B: ({formatAnswer(points.x2.toString())}, {formatAnswer(points.y2.toString())})</p>
        <p>Ratio: {formatAnswer(points.r1.toString())}:{formatAnswer(points.r2.toString())}</p>
        <p>Current Streak: {streak}</p>
        <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className="block mb-4 p-2 bg-white rounded border border-gray-300"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      {correctMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded transition-opacity duration-1000 fade-out">
          Correct!
        </div>
      )}
      {explanation && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded" style={{ whiteSpace: 'pre-line' }}>
          {explanation}
        </div>
      )}
      <div>
        <h2 className="text-xl mb-2">Where is Point C?</h2>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option)}
            disabled={correctMessage || explanation !== null} // Disable buttons during the delay
            className="block mb-2 p-2 bg-[#3557CD] text-white rounded hover:bg-[#2748a4] mx-auto"
          >
            ({formatAnswer(option.xc)}, {formatAnswer(option.yc)})
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;