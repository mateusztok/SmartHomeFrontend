import React, { useEffect, useState } from 'react';
import './Control.css';
import fetchFieldsDictionary from '../../components/Fetch/Fetch'; 
import { useOutletContext } from 'react-router-dom';

// add support for changing the color of bulbs
// add support for waiting for doors and gates to be closed and opened
// display bulbs and fans in the right place when resizing the browser window  

function Control() {
  const { sensorData } = useOutletContext();
  const [leds, setLeds] = useState({
    1: { red: 0, green: 0, blue: 0 },
    2: { red: 0, green: 0, blue: 0 },
    3: { red: 0, green: 0, blue: 0 },
    4: { red: 0, green: 0, blue: 0 },
    5: { red: 0, green: 0, blue: 0 },
    6: { red: 0, green: 0, blue: 0 },
  });

  const [fans, setFans] = useState({
    5: 0,
    6: 0,
  });

  const [gateStatus, setGateStatus] = useState('is close');
  const [doorStatus, setDoorStatus] = useState('is close');
  const [solarPanelStatus, setSolarPanelStatus] = useState('is close');
  const [clickedLed, setClickedLed] = useState(null);
  const [clickedFan, setClickedFan] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (sensorData) {
      if (sensorData && sensorData.energy && sensorData.energy.leds) {
        setLeds(sensorData.energy.leds);
      }
      
      if (sensorData && sensorData.control) {
        const fan1Status = sensorData.control.fan_1_control_status;
        const fan2Status = sensorData.control.fan_2_control_status;
        setFans({
          5: fan1Status,
          6: fan2Status,
        });

    }
    setGateStatus(sensorData.control.gate_control === 0 ? 'is close' : 'is open');
    setDoorStatus(sensorData.control.door_servo_control === 0 ? 'is close' : 'is open');
    setSolarPanelStatus(sensorData.control.servo_horizontal_control === 0 && sensorData.control.servo_vertical_control === 0 ? 'is close' : 'is open');
  }
}, [sensorData]);

  const handleSolarPanelClick = async () => {
    const { vertical, horizontal } = solarPanelStatus;
  
    const newVerticalStatus = vertical === 0 ? 90 : 0;
    const newHorizontalStatus = horizontal === 0 ? 90 : 0;
  
    try {
      const responseVertical = await fetch('http://localhost:8000/api/control/servo-vertical/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: newVerticalStatus }),
      });
  
      const responseHorizontal = await fetch('http://localhost:8000/api/control/servo-horizontal/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: newHorizontalStatus }),
      });
  
      if (!responseVertical.ok || !responseHorizontal.ok) {
        throw new Error('Failed to update solar panel status');
      }
  
      setSolarPanelStatus({ vertical: newVerticalStatus, horizontal: newHorizontalStatus });

    } catch (error) {
      console.error('Error updating solar panel:', error);
    }
  };

  const handleBulbClick = async (ledNumber) => {
    const led = leds[ledNumber];

    if (led.red === 0 && led.green === 0 && led.blue === 0) {
      setClickedLed(ledNumber);
      setPendingUpdate(ledNumber);
      const newRgb = { red: 255, green: 255, blue: 255 };
      try {
        const response = await fetch(`http://localhost:8000/api/control/led/${ledNumber}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRgb),
        });

        if (!response.ok) {
          throw new Error('Failed to update LED');
        }

        setTimeout(async () => {
          const fetchedData = await fetchFieldsDictionary();
          if (fetchedData && fetchedData.energy && fetchedData.energy.leds) {
            setLeds(fetchedData.energy.leds);
          }
          setPendingUpdate(null);
        }, 2000);
      } catch (error) {
        console.error('Error updating LED:', error);
        setPendingUpdate(null);
      }
    } else {
      setClickedLed(ledNumber);
      setPendingUpdate(ledNumber);
      const newRgb = { red: 0, green: 0, blue: 0 };
      try {
        const response = await fetch(`http://localhost:8000/api/control/led/${ledNumber}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRgb),
        });

        if (!response.ok) {
          throw new Error('Failed to reset LED');
        }
      } catch (error) {
        console.error('Error resetting LED:', error);
        setPendingUpdate(null);
      }
    }
  };

  const handleFanClick = async (fanNumber) => {
    const currentStatus = fans[fanNumber];
    const newStatus = currentStatus === 0 ? 1 : 0;

    setClickedFan(fanNumber);
    try {
      const response = await fetch(`http://localhost:8000/api/control/fan/${fanNumber-4}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update fan status');
      }

      setFans((prevFans) => ({
        ...prevFans,
        [fanNumber]: newStatus,
      }));

      
    } catch (error) {
      console.error('Error updating fan:', error);
      setPendingUpdate(null);
    }
  };

  const handleControlClick = async (controlType) => {
    let newStatus;
    const controlMap = {
      'gate': gateStatus,
      'door-servo': doorStatus,
    };

    newStatus = controlMap[controlType] === 0 ? 90 : 0; 

    try {
      const response = await fetch(`http://localhost:8000/api/control/${controlType}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${controlType} status`);
      }
     
      if (controlType === 'gate') {
        setGateStatus(newStatus);
      } else if (controlType === 'door-servo') {
        setDoorStatus(newStatus);
      }
    } catch (error) {
      console.error(`Error updating ${controlType}:`, error);
    }
  };

  const getBulbStyle = (led, ledNumber) => {
    const { red, green, blue } = led;
    const isClicked = clickedLed === ledNumber;
    const isPending = pendingUpdate === ledNumber;

    if (isPending) {
      return {
        backgroundColor: red === 0 && green === 0 && blue === 0 ? 'yellow' : 'white',
      };
    }
    if (red === 0 && green === 0 && blue === 0) {
      return {
        backgroundColor: 'white',
      };
    }

    return {
      backgroundColor: `rgb(${red}, ${green}, ${blue})`,
    };
  };

  const getFanStyle = (fanStatus) => {
    return fanStatus !== 0 ? { animation: 'rotateFan 2s linear infinite' } : {};
  };

  const getDoorGateButtonLabel = (status) => (status === 0 ? 'is close' : 'is open');

  const getSolarPanelButtonLabel = ({ vertical, horizontal }) => {
    if (vertical === 0 && horizontal === 0) {
      return 'is close';
    } else {
      return 'is open';
    }
  };
  
  return (
    <div className='control-container'>
      <div className="house-container">
        <div className="room" id="attic">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['1'], 1)}
            onClick={() => handleBulbClick(1)}
          ></button>
        </div>
        <div className="room" id="room1">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['2'], 2)}
            onClick={() => handleBulbClick(2)}
          ></button>
        </div>
        <div className="room" id="room5">
          <button
            className="fan-btn"
            style={getFanStyle(fans['5'])}
            onClick={() => handleFanClick(5)}
          ></button>
        </div>
        <div className="room" id="room6">
          <button
            className="fan-btn"
            style={getFanStyle(fans['6'])}
            onClick={() => handleFanClick(6)}
          ></button>
        </div>
        <div className="room" id="room2">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['3'], 3)}
            onClick={() => handleBulbClick(3)}
          ></button>
        </div>
        <div className="room" id="room3">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['4'], 4)}
            onClick={() => handleBulbClick(4)}
          ></button>
        </div>
        <div className="room" id="room4">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['5'], 5)}
            onClick={() => handleBulbClick(5)}
          ></button>
        </div>
      </div>
      <div className='control-button-container'>
      <button className='control-button' onClick={() => handleControlClick('gate')}>
        Gate: {getDoorGateButtonLabel(gateStatus)}
      </button>
      <button className='control-button' onClick={() => handleControlClick('door-servo')}>
        Door: {getDoorGateButtonLabel(doorStatus)}
      </button>
      <button className='control-button' onClick={handleSolarPanelClick}>
        Solar panel: {getSolarPanelButtonLabel(solarPanelStatus)}
      </button>
      </div>
    </div>
  );
}

export default Control;
