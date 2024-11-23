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

  return (
    <div className="energy-consumption-container">
      <div className='energy-consumption-row'>
        <div className='sensor-item' >
          <div className='measurement-name'>Current</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_consumption?.current_data?.value ?? '-'}</div> 
        </div>
        <div className='sensor-item' >
          <div className='measurement-name'>Power</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_consumption?.power_data?.value ?? '-'}</div>
        </div>
      </div>
      <div className='energy-consumption-row'>
        <div className='sensor-item'>
          <div className='measurement-name'>Supply</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_consumption?.supply_data?.value ?? '-'}</div> 
        </div>
        <div className='sensor-item'>
          <div className='measurement-name'>Bus</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_consumption?.bus_data?.value ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default EnergyConsumption;
