import React, { useEffect, useState } from 'react';
import './EnergyProduction.css'; 
import { useNavigate, useOutletContext } from 'react-router-dom';

function EnergyProduction() {
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
          label: 'Manufactured Energy',  
          data: [5, 10, 15],  
          fill: false,
          borderColor: 'rgba(75,192,192,1)',  
        },
      ],
    };

    // navigate('/chart', { state: { chartData } });
  };

  return (
    <div className="energy-production-container">
      <div className='energy-production-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('current')}>
          <div className='measurement-name'>Current</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_production?.current_data ?? '-'}</div>
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('power')}>
          <div className='measurement-name'>Power</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_production?.power_data ?? '-'}</div>
        </div>
      </div>
      <div className='energy-production-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('charge')}>
          <div className='measurement-name'>Charge</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_production?.charge_data ?? '-'}</div> 
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('manufactured')}>
          <div className='measurement-name'>Manufactured Energy</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_production?.manufactured_energy_data ?? '-'}</div> 
        </div>
      </div>
    </div>
  );
}

export default EnergyProduction;
