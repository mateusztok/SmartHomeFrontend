import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Layout.css'; 
import fetchFieldsDictionary from '../Fetch/Fetch';
import { useNavigate } from 'react-router-dom';
import thresholds from '../../utils/Thresholds.js';
import { Outlet, useLocation } from 'react-router-dom';

function Layout() {
  const [sensorData, setSensorData] = useState(null);
  const [outletKey, setOutletKey] = useState(0); 
  const navigate = useNavigate();
  const location = useLocation();

  const checkSensorValues = async () => {
    const data = await fetchFieldsDictionary();
    if (data) {
      const alerts = [];
      setSensorData(data); 

      if (data.security.tilt_sensor_status > thresholds.tilt_sensor) {
        alerts.push('Tilt sensor value exceeded the limit!');
      }
      if (data.security.pir_sensor_1_status > thresholds.pir_sensor_1) {
        alerts.push('PIR sensor 1 value exceeded the limit!');
      }
      if (data.security.pir_sensor_2_status > thresholds.pir_sensor_2) {
        alerts.push('PIR sensor 2 value exceeded the limit!');
      }
      if (data.security.radiation_sensitive_status > thresholds.radiation_sensitive) {
        alerts.push('Radiation sensitive sensor value exceeded the limit!');
      }
      if (data.security.flame_sensor_status > thresholds.flame_sensor) {
        alerts.push('Flame sensor value exceeded the limit!');
      }
      if (data.environment.temperature_data.value > thresholds.temperature) {
        alerts.push('Temperature exceeded the limit!');
      }
      if (data.environment.humidity_data.value > thresholds.humidity) {
        alerts.push('Humidity exceeded the limit!');
      }
      if (data.environment.pressure_data.value > thresholds.pressure) {
        alerts.push('Pressure exceeded the limit!');
      }
      if (data.environment.gas_data.value > thresholds.gas) {
        alerts.push('Gas sensor value exceeded the limit!');
      }
      if (data.energy.intensity_sensor_data > thresholds.intensity_sensor) {
        alerts.push('Intensity sensor value exceeded the limit!');
      }

      if (alerts.length > 0) {
        navigate('/');
      }
      if(location.pathname !== '/settings'){
      setOutletKey(prevKey => prevKey + 1);}
    }
  };

  useEffect(() => {
    checkSensorValues(); 
    const interval = setInterval(checkSensorValues, 5000); 
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div className="layout-container">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="content-container">
        <Outlet context={{ sensorData }} key={outletKey} />
      </div>
    </div>
  );
}

export default Layout;
