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

  return (
    <div className="energy-production-container">
      <div className='energy-production-row'>
        <div className='sensor-item'>
          <div className='measurement-name'>Current</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_production?.current_data?.value ?? '-'}</div>
        </div>
        <div className='sensor-item' >
          <div className='measurement-name'>Power</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_production?.power_data?.value ?? '-'}</div>
        </div>
      </div>
      <div className='energy-production-row'>
        <div className='sensor-item' >
          <div className='measurement-name'>Supply</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_production?.supply_data?.value ?? '-'}</div> 
        </div>
        <div className='sensor-item' >
          <div className='measurement-name'>Bus</div>
          <div className='sensor-value'>{sensorData?.energy?.energy_production?.bus_data?.value ?? '-'}</div> 
        </div>
      </div>
    </div>
  );
}

export default EnergyProduction;
