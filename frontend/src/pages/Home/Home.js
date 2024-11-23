import React, { useEffect, useState } from 'react';
import './Home.css'; 
import thresholds from '../../utils/Thresholds.js';
import { useOutletContext } from 'react-router-dom';

function Home() {
  const [alertedSensors, setAlertedSensors] = useState([]); 
  const { sensorData } = useOutletContext(); 
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); 

  useEffect(() => {
    if (sensorData) {
      checkAlerts(sensorData); 
    }
  }, [sensorData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkAlerts = (data) => {
    const alerts = [];

    if (data.security?.tilt_sensor_status?.alarm_on) {
        alerts.push('tilt_sensor');
    }
    if (data.security?.pir_sensor_1_status?.alarm_on) {
        alerts.push('pir_sensor_1');
    }
    if (data.security?.pir_sensor_2_status?.alarm_on) {
        alerts.push('pir_sensor_2');
    }
    if (data.security?.radiation_sensitive_status?.alarm_on) {
        alerts.push('radiation_sensitive');
    }
    if (data.security?.flame_sensor_status?.alarm_on) {
        alerts.push('flame_sensor');
    }

    setAlertedSensors(alerts);
  };

  const handleAlarmToggle = async () => {
    const newStatus = sensorData.security?.is_alarm_armed  ? 0 : 1;
  
    try {
      await fetch('http://localhost:8000/api/settings/set-armed-alarm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: newStatus }),
      });
    } catch {}
  };

  const handleBuzzerToggle = async () => {
    try {
      await fetch('http://localhost:8000/api/security/buzzer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {}
  };

  return (
    <div className="home-container">
      <div className='home-header'><h1>Your SmartHome</h1></div>
      <div className='time-display'>{currentTime}</div>
      <div className='security-container'>
        <div className='security-table-container'>
          <div className='sensor-row'>
            <div className='sensor-item'>Security</div>
          </div>
          <div className='security-row'>
            <div className={`sensor-item ${alertedSensors.includes('radiation_sensitive') ? 'alert' : ''}`}>
              <div className='measurement-name'>Radiation Sensitive Sensor</div>
              <div className='sensor-value'>
                {sensorData?.security?.radiation_sensitive_status?.value || '-'}
              </div>
            </div>
            <div className={`sensor-item ${alertedSensors.includes('flame_sensor') ? 'alert' : ''}`}>
              <div className='measurement-name'>Flame Sensor</div>
              <div className='sensor-value'>
                {sensorData?.security?.flame_sensor_status?.value || '-'}
              </div>
            </div>
          </div>
          <div className='security-row'>
            <div className={`sensor-item ${alertedSensors.includes('pir_sensor_1') ? 'alert' : ''}`}>
              <div className='measurement-name'>PIR Sensor 1</div>
              <div className='sensor-value'>
                {sensorData?.security?.pir_sensor_1_status?.value || '-'}
              </div>
            </div>
            <div className={`sensor-item ${alertedSensors.includes('pir_sensor_2') ? 'alert' : ''}`}>
              <div className='measurement-name'>PIR Sensor 2</div>
              <div className='sensor-value'>
                {sensorData?.security?.pir_sensor_2_status?.value || '-'}
              </div>
            </div>
          </div>
          <div className='security-row'>
            <div className={`sensor-item ${alertedSensors.includes('tilt_sensor') ? 'alert' : ''}`}>
              <div className='measurement-name'>Tilt Sensor</div>
              <div className='sensor-value'>
                {sensorData?.security?.tilt_sensor_status?.value || '-'}
              </div>
            </div>
            <div className='sensor-item'>
              <div className='measurement-name'>Buzzer</div>
              <div className='sensor-value'>
              {sensorData?.security?.buzzer_control_status?.value === true ? '1' : sensorData?.security?.buzzer_control_status?.value === false ? '-' : '-'}
 
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='alarm-container'>
            <div>Alarm Arming: {sensorData?.security?.is_alarm_armed ? 'On' : 'Off'}</div>
            <button className='control-button' onClick={handleAlarmToggle}>
              Change Status
            </button>
          </div>
          <div className='alarm-container'>
            <button className='control-button' onClick={handleBuzzerToggle}>
              Turn off buzzer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
