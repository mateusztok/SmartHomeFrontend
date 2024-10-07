import React, { useEffect, useState } from 'react';
import './Environment.css';
import fetchFieldsDictionary from '../../components/Fetch/Fetch';
import { useNavigate } from 'react-router-dom';

function Environment() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const result = await fetchFieldsDictionary();
      setData(result);
      setLoading(false);
    };

    getData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSensorClick = (measurementType) => {
    const chartData = {
      labels: ['10:00', '11:00', '12:00'],  
      datasets: [
        {
          label: 'Measurement',  
          data: [22, 23, 24], 
          fill: false,
          borderColor: 'rgba(75,192,192,1)',  
        },
      ],
    };

    navigate('/chart', { state: { chartData } });
  };

  return (
    <div className="environment-container">
      <div className='environment-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('temperature')}>
          <div className='measurement-name'>Temperature</div>
          <div className='sensor-value'>{data?.environment?.temperature_data ?? '-'}</div>
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('pressure')}>
          <div className='measurement-name'>Pressure</div>
          <div className='sensor-value'>{data?.environment?.pressure_data ?? '-'}</div>
        </div>
      </div>
      <div className='environment-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('humidity')}>
          <div className='measurement-name'>Humidity</div>
          <div className='sensor-value'>{data?.environment?.humidity_data ?? '-'}</div>
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('light')}>
          <div className='measurement-name'>Light Intensity</div>
          <div className='sensor-value'>{data?.environment?.intensity_sensor_data ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default Environment;
