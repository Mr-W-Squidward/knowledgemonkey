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
  const [points, setPoints] = useState<Partial<Point>>({});
  const [options, setOptions] = useState<Option[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<Option>({ xc: '0', yc: '0' });
  const [explanation, setExplanation] = useState<string | null>(null);
  const [correctMessage, setCorrectMessage] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(150); // 150 seconds for 2:30 minutes

  // Function to generate a new question
  const generateQuestion = () => {
    // Generate points and ratios
    const { x1, y1, x2, y2, r1, r2 } = generatePointsAndRatio();
    // Calculate the correct coordinates for point C
    const { xc, yc, explanationX, explanationY, fractionalX, fractionalY } = calculatePointC(x1, y1, x2, y2, r1, r2);
    
    // Create a new points object with all necessary data
    const newPoints = { x1, y1, x2, y2, xc, yc, r1, r2, explanationX, explanationY, fractionalX, fractionalY };
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
    setTimeLeft(150); // Reset timer to 2:30 minutes
  };

  // We use 'useEffect' to generate a new question when the component first mounts
  useEffect(() => {
    generateQuestion();
  }, []);

  // We use 'useEffect' to handle the countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setStreak(0);
          generateQuestion();
          return 150; // Reset timer
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);

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
        generateQuestion();
      }, 1000);
    } else {
      setStreak(0);
      // Set an explanation if the answer is incorrect
      setExplanation(
        `The correct coordinates for point C are (${correctAnswer.xc}, ${correctAnswer.yc}).
        Calculation steps:
        For x: 
        ${points.explanationX}
        For y: 
        ${points.explanationY}`
      );
    }
  };

  // Format time from seconds into Minutes:Seconds format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    // The structure of the page +  tailwind styling
    <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4 text-primary">Division Point Quiz</h1>
      <div className="flex flex-col items-center mb-4">
        <p>Time Left: {formatTime(timeLeft)}</p>
        <p>Point A: ({points.x1}, {points.y1})</p>
        <p>Point B: ({points.x2}, {points.y2})</p>
        <p>Ratio: {points.r1}:{points.r2}</p>
        <p>Current Streak: {streak}</p>
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
            className="block mb-2 p-2 bg-[#3557CD] text-white rounded hover:bg-[#2748a4] mx-auto"
          >
            ({option.xc}, {option.yc})
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;