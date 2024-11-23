import React, { useState, useEffect } from 'react';
import './Settings.css'; 
import fetchFieldsDictionary from '../../components/Fetch/Fetch'; 

// improve appearance
// support confirmations of performed operations

function Settings() {
  const [sensorData, setSensorData] = useState(null);
  const [lightValue, setLightValue] = useState('');
  const [alarmValue, setAlarmValue] = useState('');
  const [newPin, setNewPin] = useState({ pin1: '', pin2: '', pin3: '' });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFieldsDictionary();
      if (data) {
        setSensorData(data);
      }
    };

    fetchData();
  }, []);

  const fetchLatestData = async () => {
    const data = await fetchFieldsDictionary();
    if (data) {
      setSensorData(data);
    }
  };

  const handleLightValueChange = (e) => {
    setLightValue(e.target.value);
  };

  const handleAlarmTimeValueChange = (e) => {
    setAlarmValue(e.target.value);
  };

  const handlePinChange = (e) => {
    const { id, value } = e.target;
    setNewPin((prev) => ({ ...prev, [id]: value }));
  };

  const handleLightValueSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/settings/light-sensitivity/', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: lightValue }), 
      });
      if (response.ok) {
        console.log('Light value updated successfully');
        fetchLatestData();
      } else {
        console.error('Failed to update light value');
      }
    } catch (error) {
      console.error('Error updating light value:', error);
    }
  };

  const handleAddRFID = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/security/set-rfid/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner: "0" }), 
      });
      if (response.ok) {
        console.log('RFID added successfully');
      } else {
        console.error('Failed to add RFID');
      }
    } catch (error) {
      console.error('Error adding RFID:', error);
    }
  };

  const handlePinSubmit = async () => {
    if (newPin.pin1 !== newPin.pin2) {
      console.error('New pins do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/security/change-current-pin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({old_pin: newPin.pin3, new_pin: newPin.pin1 }),
      });
      if (response.ok) {
        console.log('Pin changed successfully');
        fetchLatestData();
      } else {
        console.error('Failed to change pin');
      }
    } catch (error) {
      console.error('Error changing pin:', error);
    }
  };

  const handleAlarmTimeValueSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/settings/set-alarm/', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: alarmValue }), 
      });
      if (response.ok) {
        console.log('Light value updated successfully');
        fetchLatestData();
      } else {
        console.error('Failed to update light value');
      }
    } catch (error) {
      console.error('Error updating light value:', error);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      <div className="setting-item">
        <label htmlFor="lightValue">Value to turn on the outdoor light: {sensorData?.settings?.light_sensor_sensitivity}</label>
        <input 
          type="number" 
          id="lightValue" 
          placeholder="Enter value" 
          value={lightValue} 
          onChange={handleLightValueChange} 
        />
        <button onClick={handleLightValueSubmit}>Submit</button>
      </div>

      <div className="setting-item">
        <label htmlFor="alarmValue">Change alarm time: {sensorData?.settings?.alarm_time}</label>
        <input 
          type="number" 
          id="alarmValue" 
          placeholder="Enter value" 
          value={alarmValue} 
          onChange={handleAlarmTimeValueChange} 
        />
        <button onClick={handleAlarmTimeValueSubmit}>Submit</button>
      </div>

      <div className="setting-item">
        <label>Add new RFID:</label>
        <button onClick={handleAddRFID}>Add RFID</button>
      </div>

      <div className="setting-item">
        <label>Change pin:</label>
        <div>
          <input 
            type="password" 
            id="pin1" 
            placeholder="Enter new pin" 
            value={newPin.pin1} 
            onChange={handlePinChange} 
          />
          <input 
            type="password" 
            id="pin2" 
            placeholder="Confirm new pin" 
            value={newPin.pin2} 
            onChange={handlePinChange} 
          />
          <input 
            type="password" 
            id="pin3" 
            placeholder="Enter old pin" 
            value={newPin.pin3} 
            onChange={handlePinChange} 
          />
        </div>
        <button onClick={handlePinSubmit}>Submit Pin Change</button>
      </div>
    </div>
  );
}

export default Settings;
