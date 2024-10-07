import React, { useEffect, useState } from 'react';
import './Control.css';
import fetchFieldsDictionary from '../../components/Fetch/Fetch'; 

function Control() {
  const [leds, setLeds] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });

  const [fans, setFans] = useState({
    5: 0,
    6: 0,
  });

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchFieldsDictionary();
      if (fetchedData && fetchedData.energy && fetchedData.energy.leds) {
        setLeds(fetchedData.energy.leds);
      }
      if (fetchedData && fetchedData.energy && fetchedData.energy.fans) {
        setFans(fetchedData.energy.fans);
      }
    };

    getData();
  }, []);

  const handleBulbClick = (ledNumber) => {
    setLeds((prevLeds) => ({
      ...prevLeds,
      [ledNumber]: prevLeds[ledNumber] === 1 ? 0 : 1, 
    }));
  };

  const handleFanClick = (fanNumber) => {
    setFans((prevFans) => ({
      ...prevFans,
      [fanNumber]: prevFans[fanNumber] === 1 ? 0 : 1, 
    }));
  };

  const getBulbStyle = (ledStatus) => {
    return ledStatus === 1 ? { backgroundColor: 'yellow' } : { backgroundColor: 'white' };
  };

  const getFanStyle = (fanStatus) => {
    return fanStatus === 1 ? { animation: 'rotateFan 2s linear infinite' } : {};
  };

  return (
    <div className='control-container'>
      <div className="house-container">
        <div className="room" id="attic">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['1'])}
            onClick={() => handleBulbClick(1)}
          ></button>
        </div>
        <div className="room" id="room1">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['2'])}
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
            style={getBulbStyle(leds['3'])}
            onClick={() => handleBulbClick(3)}
          ></button>
        </div>
        <div className="room" id="room3">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['4'])}
            onClick={() => handleBulbClick(4)}
          ></button>
        </div>
        <div className="room" id="room4">
          <button
            className="bulb-btn"
            style={getBulbStyle(leds['5'])}
            onClick={() => handleBulbClick(5)}
          ></button>
        </div>
      </div>
      <div className='control-button-container'>
        <div className='control-button'>Gate</div>
        <div className='control-button'>Door</div>
        <div className='control-button'>Solar panel</div>
      </div>
    </div>
  );
}

export default Control;
