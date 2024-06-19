import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import 'chart.js/auto';

// Removes the unwanted '/1' if the last two characters are '/1'
const formatAnswer = (answer: string) => {
  return answer.endsWith('/1') ? answer.slice(0, -2) : answer;
};

interface GraphProps {
  points: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    xc: number;
    yc: number;
    fractionalX: string;
    fractionalY: string;
  };
}

const Graph: React.FC<GraphProps> = ({ points }) => {
  const data = {
    labels: ['A', 'C', 'B'],
    datasets: [
      {
        label: 'Line Segment',
        data: [
          { x: points.x1, y: points.y1, label: 'A' },
          { x: points.xc, y: points.yc, label: 'C' },
          { x: points.x2, y: points.y2, label: 'B' },
        ],
        borderColor: 'blue',
        backgroundColor: 'blue',
        fill: false,
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: -10,
        max: 10,
      },
      y: {
        min: -10,
        max: 10,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.data[context.dataIndex] as any;
            if (label.label === 'C') {
              return `C: (${formatAnswer(points.fractionalX)}, ${formatAnswer(points.fractionalY)})`;
            } else {
              return `${label.label}: (${context.parsed.x}, ${context.parsed.y})`;
            }
          },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default Graph;
