"use client";

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Page = () => {
  const [data, setData] = useState({
    x: [],
    y: [],
    z: [],
    time: []
  });
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Accelerometer' in window) {
      const accelerometer = new Accelerometer({ frequency: 60 });

      const handleReading = () => {
        const currentTime = Date.now();
        const newTime = currentTime - startTime;

        setData(prevData => ({
          x: [...prevData.x, accelerometer.x || 0],
          y: [...prevData.y, accelerometer.y || 0],
          z: [...prevData.z, accelerometer.z || 0],
          time: [...prevData.time, newTime]
        }));
      };

      accelerometer.addEventListener('reading', handleReading);
      accelerometer.start();

      return () => {
        accelerometer.removeEventListener('reading', handleReading);
        accelerometer.stop();
      };
    } else {
      console.error('Accelerometer not supported');
    }
  }, [startTime]);

  const createChartData = (axisData, axisLabel) => ({
    labels: data.time,
    datasets: [
      {
        label: axisLabel,
        data: axisData,
        borderColor: axisLabel === 'X-axis' ? 'rgba(255, 99, 132, 0.2)' :
                   axisLabel === 'Y-axis' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(75, 192, 192, 0.2)',
        backgroundColor: axisLabel === 'X-axis' ? 'rgba(255, 99, 132, 0.2)' :
                         axisLabel === 'Y-axis' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: false,
        pointRadius: 3,  // Adjust point size if needed
      }
    ],
  });

  return (
    <div className="accelerometer">
      <h2>Accelerometer Data Over Time</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>X-axis</h3>
        <Line data={createChartData(data.x, 'X-axis')} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Y-axis</h3>
        <Line data={createChartData(data.y, 'Y-axis')} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Z-axis</h3>
        <Line data={createChartData(data.z, 'Z-axis')} />
      </div>
    </div>
  );
};

export default Page;
