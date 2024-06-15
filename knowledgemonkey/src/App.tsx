import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Graph from './components/Graph';
import './index.css';

const App: React.FC = () => {
  const [points, setPoints] = useState({
    x1: 0,
    y1: 0,
    x2: 5,
    y2: 5,
    xc: 2,
    yc: 2,
    fractionalX: '0.0',
    fractionalY: '0.0',
  });

  const handlePointsUpdate = (newPoints: any) => {
    setPoints(newPoints);
  };

  return (
    <div className="container mx-auto p-4">
      <Quiz onPointsUpdate={handlePointsUpdate} />
      <Graph points={points} />
    </div>
  );
};

export default App;