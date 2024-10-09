import React, { useState, useEffect } from 'react';
import './Settings.css'; 
import fetchFieldsDictionary from '../../components/Fetch/Fetch'; 

// improve appearance
// support confirmations of performed operations

function Settings() {
  const [sensorData, setSensorData] = useState(null);
  const [lightValue, setLightValue] = useState('');
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

  const handleLightValueChange = (e) => {
    setLightValue(e.target.value);
  };

  const handlePinChange = (e) => {
    const { id, value } = e.target;
    setNewPin((prev) => ({ ...prev, [id]: value }));
  };

  const handleLightValueSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/control/turnOnLight/', { // change URL to the correct one
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lightValue: lightValue }), 
      });
      if (response.ok) {
        console.log('Light value updated successfully');
      } else {
        console.error('Failed to update light value');
      }
    } catch (error) {
      console.error('Error updating light value:', error);
    }
  };

  // Function to add a new RFID
  const handleAddRFID = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/control/addRFID/', { // change URL to the correct one
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch('http://localhost:8000/api/control/changePin/', { // change URL to the correct one
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPin: newPin.pin3, newPin: newPin.pin1 }),
      });
      if (response.ok) {
        console.log('Pin changed successfully');
      } else {
        console.error('Failed to change pin');
      }
    } catch (error) {
      console.error('Error changing pin:', error);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      <div className="setting-item">
        <label htmlFor="lightValue">Value to turn on the outdoor light: {sensorData?.energy?.lightsensitivity}</label>
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
