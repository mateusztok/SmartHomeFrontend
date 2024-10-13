import React, { useEffect, useState } from 'react';
import './EnergyConsumption.css'; 
import { useNavigate, useOutletContext } from 'react-router-dom';

function EnergyConsumption() {
  const { sensorData } = useOutletContext(); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (sensorData) {
      setLoading(false); 
    }
  }, [sensorData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSensorClick = (measurementType) => {
    const chartData = {
      labels: ['10:00', '11:00', '12:00'],  
      datasets: [
        {
          label: 'Measurement',  
          data: [10, 20, 30],  
          fill: false,
          borderColor: 'rgba(75,192,192,1)',  
        },
      ],
    };

    // navigate('/chart', { state: { chartData } });
  };

  return (
    <div className="energy-consumption-container">
      <div className='energy-consumption-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('current')}>
          <div className='measurement-name'>Current</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_consumption?.current_data ?? '-'}</div> 
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('power')}>
          <div className='measurement-name'>Power</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_consumption?.power_data ?? '-'}</div>
        </div>
      </div>
      <div className='energy-consumption-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('charge')}>
          <div className='measurement-name'>Supply</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_consumption?.supply_data ?? '-'}</div> 
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('consumed')}>
          <div className='measurement-name'>Bus</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_consumption?.bus_data ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default EnergyConsumption;
