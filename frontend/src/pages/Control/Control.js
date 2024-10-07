import React from 'react';
import './Control.css';

function Control() {
  return (
    <div className='control-container'>
        <div className="house-container">
            <div className="room" id="attic">
                <button className="bulb-btn"></button>
            </div>
            <div className="room" id="room1">
                <button className="bulb-btn"></button>
            </div>
            <div className="room" id="room5">
                <button className="fan-btn"></button>
            </div>
            <div className="room" id="room6">
                <button className="fan-btn"></button>
            </div>
            <div className="room" id="room2">
                <button className="bulb-btn"></button>
            </div>
            <div className="room" id="room3">
                <button className="bulb-btn"></button>
            </div>
            <div className="room" id="room4">
                <button className="bulb-btn"></button>
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
