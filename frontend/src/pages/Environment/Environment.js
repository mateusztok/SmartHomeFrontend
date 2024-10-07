import React, { useEffect, useState } from 'react';
import './Environment.css'; 
import fetchFieldsDictionary from '../../components/Fetch/Fetch'; 

function Environment() {
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
    <div className="environment-container">
      <div className='environment-row'>
        <div className='sensor-item'>
          <div className='measurement-name'>Temperature</div>
          <div className='sensor-value'>{data?.environment?.temperature_data ?? '-'}</div>
        </div>
        <div className='sensor-item'>
          <div className='measurement-name'>Pressure</div>
          <div className='sensor-value'>{data?.environment?.pressure_data ?? '-'}</div>
        </div>
      </div>
      <div className='environment-row'>
        <div className='sensor-item'>
          <div className='measurement-name'>Humidity</div>
          <div className='sensor-value'>{data?.environment?.humidity_data ?? '-'}</div>
        </div>
        <div className='sensor-item'>
          <div className='measurement-name'>Light Intensity</div>
          <div className='sensor-value'>{data?.environment?.intensity_sensor_data ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default Environment;
