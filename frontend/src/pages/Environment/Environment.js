import React, { useEffect, useState } from 'react';
import './Environment.css';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

function Environment() {
  const { sensorData } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (sensorData) {
      setLoading(false); 
    }
  }, [sensorData]);

  const handleSensorClick = async (measurementType) => {
    try {
      const response = await fetch(`http://localhost:8000/api/historical/type/${measurementType}/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      
      const chartData = {
        labels: data.map(entry => new Date(entry.date).toLocaleString()), 
        datasets: [
            {
                label: 'Measurement',
                data: data.map(entry => entry.value),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
      };
  
      navigate('/chart', { state: { chartData } });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sensorValue = (data) => data?.value ?? '-';
  
  return (
    <div className="environment-container">
      <div className='environment-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('T')}>
          <div className='measurement-name'>Temperature</div>
          <div className='sensor-value'>{sensorValue(sensorData?.environment?.temperature_data)}</div>
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('P')}>
          <div className='measurement-name'>Pressure</div>
          <div className='sensor-value'>{sensorValue(sensorData?.environment?.pressure_data)}</div>
        </div>
      </div>
      <div className='environment-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('H')}>
          <div className='measurement-name'>Humidity</div>
          <div className='sensor-value'>{sensorValue(sensorData?.environment?.humidity_data)}</div>
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('G')}>
          <div className='measurement-name'>Gas</div>
          <div className='sensor-value'>{sensorValue(sensorData?.environment?.gas_data)}</div>
        </div>
      </div>
    </div>
  );
}

export default Environment;
