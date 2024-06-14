import React, { useState, useEffect } from 'react';
import { generatePointsAndRatio, calculatePointC, generateFakeOptions } from '../utils';

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
  const [points, setPoints] = useState<Partial<Point>>({});
  const [options, setOptions] = useState<Option[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<Option>({ xc: '0', yc: '0' });
  const [explanation, setExplanation] = useState<string | null>(null);
  const [correctMessage, setCorrectMessage] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  const generateQuestion = () => {
    const { x1, y1, x2, y2, r1, r2 } = generatePointsAndRatio();
    const { xc, yc, explanationX, explanationY, fractionalX, fractionalY } = calculatePointC(x1, y1, x2, y2, r1, r2);
    
    const newPoints = { x1, y1, x2, y2, xc, yc, r1, r2, explanationX, explanationY, fractionalX, fractionalY };
    setPoints(newPoints);
    onPointsUpdate(newPoints);
    
    const fakeOptions = generateFakeOptions(fractionalX, fractionalY);
    const allOptions = [...fakeOptions, { xc: fractionalX, yc: fractionalY }];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
    setCorrectAnswer({ xc: fractionalX, yc: fractionalY });
    setExplanation(null);
    setCorrectMessage(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswerClick = (option: Option) => {
    if (option.xc === correctAnswer.xc && option.yc === correctAnswer.yc) {
      setCorrectMessage(true);
      setStreak(streak + 1);
      const audio = new Audio('/ding.mp3');
      audio.play();
      setTimeout(() => {
        generateQuestion();
      }, 1000);
    } else {
      setStreak(0);
      setExplanation(
        `The correct coordinates for point C are (${correctAnswer.xc}, ${correctAnswer.yc}).
        Calculation steps:
        For x: ${points.explanationX}
        For y: ${points.explanationY}`
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Multiple Choice Quiz</h1>
      <div className="mb-4">
        <p>Point A: ({points.x1}, {points.y1})</p>
        <p>Point B: ({points.x2}, {points.y2})</p>
        <p>Ratio: {points.r1}:{points.r2}</p>
      </div>
      <div className="mb-4">
        <p>Current Streak: {streak}</p>
      </div>
      {correctMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded transition-opacity duration-1000 fade-out">
          Correct!
        </div>
      )}
      {explanation && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {explanation}
        </div>
      )}
      <div>
        <h2 className="text-xl mb-2">Where is Point C?</h2>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option)}
            className="block mb-2 p-2 bg-blue-500 text-white rounded"
          >
            ({option.xc}, {option.yc})
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;