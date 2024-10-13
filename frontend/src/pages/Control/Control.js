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

  const [gateStatus, setGateStatus] = useState(0);
  const [doorStatus, setDoorStatus] = useState(0);
  const [isSolarInSafePosition, setIsSolarInSafePosition] = useState('is in safe position');
  const [clickedLed, setClickedLed] = useState(null);
  const [clickedFan, setClickedFan] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (sensorData) {
      if (sensorData?.energy?.leds) {
        setLeds(sensorData.energy.leds);
      }
      
      if (sensorData?.control) {
        const fan1Status = sensorData.control.fan_1_control_status;
        const fan2Status = sensorData.control.fan_2_control_status;
        setFans({
          5: fan1Status,
          6: fan2Status,
        });

    }
    setGateStatus(sensorData.control.gate_control);
    setDoorStatus(sensorData.control.door_servo_control);
    setIsSolarInSafePosition(sensorData.control.is_solar_in_safe_position);
  }
}, [sensorData]);

  const handleSolarPanelClick = async () => {
    let newStatus;
    if (isSolarInSafePosition === 0) {
      newStatus = 1;
    } else if (isSolarInSafePosition === 1) {
      newStatus = 0;
    } else {
      console.error(`Invalid status. Expected 0 or 1, got:`, isSolarInSafePosition);
      return;  
    }
    try {
      const responseVertical = await fetch('http://localhost:8000/api/control/servo-vertical/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: newStatus  }),
      });
  
      if (!responseVertical.ok) {
        throw new Error('Failed to update solar panel status');
      }
  
      setIsSolarInSafePosition( 2 );

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
        [fanNumber]: 2,
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

    if (controlMap[controlType] === 0) {
      newStatus = 1;
    } else if (controlMap[controlType] === 1) {
      newStatus = 0;
    } else {
      console.error(`Invalid status for ${controlType}. Expected 0 or 1, got:`, controlMap[controlType]);
      return;  
    }
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
        setGateStatus(2);
      } else if (controlType === 'door-servo') {
        setDoorStatus(2);
      }
    } catch (error) {
      console.error(`Error updating ${controlType}:`, error);
    }
  };

  const getBulbStyle = (led, ledNumber) => {
    if (!led) {
      return { backgroundColor: 'white' };
  }
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
    if(fanStatus === 1) return { animation: 'rotateFan 2s linear infinite' };
    if(fanStatus === 0) return {};
    return;
  };

  const getDoorGateButtonLabel = (status) => {
  if(status === 0) return'is close';
  if(status ===1) return 'is open';
  return 'in progress';
  }

  const getSolarPanelButtonLabel = (isSolarInSafePosition) => {
  if (isSolarInSafePosition === 0) {
    return 'is following the sun';
  }
  if (isSolarInSafePosition === 2) {
    return 'in progress';
  }
  return 'is in safe position';
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
        Solar panel: {getSolarPanelButtonLabel(isSolarInSafePosition)}
      </button>
      </div>
    </div>
  );
}

export default Control;
