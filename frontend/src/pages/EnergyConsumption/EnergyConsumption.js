import React, { useEffect, useState } from 'react';
import './EnergyConsumption.css'; 
import fetchFieldsDictionary from '../../components/Fetch/Fetch'; 

function EnergyConsumption() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="energy-consumption-container">
      <div className='energy-consumption-row'>
        <div className='sensor-item'>
          <div className='measurement-name'>Current</div>
          <div className='sensor-value'>{data ? data.energy.current_data : '-'}</div> 
        </div>
        <div className='sensor-item'>
          <div className='measurement-name'>Power</div>
          <div className='sensor-value'>{data ? data.energy.power_data : '-'}</div>
        </div>
      </div>
      <div className='energy-consumption-row'>
        <div className='sensor-item'>
          <div className='measurement-name'>Charge</div>
          <div className='sensor-value'>{data ? data.energy.charge_data : '-'}</div> 
        </div>
        <div className='sensor-item'>
          <div className='measurement-name'>Consumed Energy</div>
          <div className='sensor-value'>{data ? data.energy.consumed_energy_data : '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default EnergyConsumption;
