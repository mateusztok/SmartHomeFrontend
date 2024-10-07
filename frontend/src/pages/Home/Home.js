import React, { useEffect, useState } from 'react';
import './Home.css'; 
import fetchFieldsDictionary from '../../components/Fetch/Fetch'; 

function Home() {
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
    <div className="home-container">
      <div className='home-header'><h1>Your SmartHome</h1></div>
      <div className='security-container'>
        <div className='sensor-row'>
          <div className='sensor-item'>Security</div>
        </div>
        <div className='security-row'>
          <div className='sensor-item'>
            <div className='measurement-name'>Air Sensor</div>
            <div className='sensor-value'>{data ? data.security.air_sensor_status : '-'}</div>
          </div>
          <div className='sensor-item'>
            <div className='measurement-name'>Fire Sensor</div>
            <div className='sensor-value'>{data ? data.security.flame_sensor_status : '-'}</div>
          </div>
        </div>
        <div className='security-row'>
          <div className='sensor-item'>
            <div className='measurement-name'>PIR Sensor</div>
            <div className='sensor-value'>{data ? data.security.pir_sensor_1_status : '-'}</div>
          </div>
          <div className='sensor-item'>
            <div className='measurement-name'>IR Sensor</div>
            <div className='sensor-value'>{data ? data.security.pir_sensor_2_status : '-'}</div>
          </div>
        </div>
        <div className='security-row'>
          <div className='sensor-item'>
            <div className='measurement-name'>Shock Sensor</div>
            <div className='sensor-value'>{data ? data.security.tilt_sensor_status : '-'}</div>
          </div>
          <div className='sensor-item'>
            <div className='measurement-name'>Buzzer</div>
            <div className='sensor-value'>{data ? data.security.buzzer_control_status : '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
