import React, { useEffect, useState } from 'react';
import './EnergyConsumption.css'; 
import fetchFieldsDictionary from '../../components/Fetch/Fetch'; 
import { useNavigate } from 'react-router-dom';

function EnergyConsumption() {
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
          data: [10, 20, 30],  
          fill: false,
          borderColor: 'rgba(75,192,192,1)',  
        },
      ],
    };

    navigate('/chart', { state: { chartData } });
  };

  return (
    <div className="energy-consumption-container">
      <div className='energy-consumption-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('current')}>
          <div className='measurement-name'>Current</div>
          <div className='sensor-value'>{data ? data.energy.current_data : '-'}</div> 
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('power')}>
          <div className='measurement-name'>Power</div>
          <div className='sensor-value'>{data ? data.energy.power_data : '-'}</div>
        </div>
      </div>
      <div className='energy-consumption-row'>
        <div className='sensor-item' onClick={() => handleSensorClick('charge')}>
          <div className='measurement-name'>Charge</div>
          <div className='sensor-value'>{data ? data.energy.charge_data : '-'}</div> 
        </div>
        <div className='sensor-item' onClick={() => handleSensorClick('consumed')}>
          <div className='measurement-name'>Consumed Energy</div>
          <div className='sensor-value'>{data ? data.energy.consumed_energy_data : '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default EnergyConsumption;
