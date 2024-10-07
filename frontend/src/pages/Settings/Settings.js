import React from 'react';
import './Settings.css'; 

function Settings() {
  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="setting-item">
        <label htmlFor="lightValue">Value to turn on the outdoor light:</label>
        <input type="number" id="lightValue" placeholder="Enter value" />
      </div>
      <div className="setting-item">
        <label htmlFor="photoresistorScaling">Photoresistor Scaling:</label>
        <input type="number" id="photoresistorScaling" placeholder="Enter scaling factor" />
      </div>
      <div className="setting-item">
        <label htmlFor="lightSensorSensitivity">Light Sensor Sensitivity:</label>
        <input type="number" id="lightSensorSensitivity" placeholder="Enter sensitivity" />
      </div>
    </div>
  );
}

export default Settings;
