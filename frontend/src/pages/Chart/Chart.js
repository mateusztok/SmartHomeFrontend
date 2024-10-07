// src/pages/Environment/ChartPage.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate, useLocation } from 'react-router-dom';
import 'chart.js/auto'; // Required for chart.js v3+

function ChartPage() {
  const navigate = useNavigate();
  const location = useLocation();  // To access the passed state
  const { chartData } = location.state || {};  // Fallback in case no state is passed

  // Use the correct data structure to render the chart
  const data = {
    labels: chartData?.labels || [],  // X-axis labels
    datasets: chartData?.datasets || []  // Y-axis values
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ position: 'relative', top: '10px', left: '10px' }}>
        Back
      </button>
      <div style={{ marginTop: '50px' }}>
        {chartData ? (
          <Line data={data} options={options} />
        ) : (
          <div>No data available for the chart.</div>
        )}
      </div>
    </div>
  );
}

export default ChartPage;
