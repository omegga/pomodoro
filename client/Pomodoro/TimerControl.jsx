import React from 'react';
import PropTypes from 'prop-types';

export const TimerControl = ({ startStop, reset }) => {
  return (
    <div className="timer-control">
      <div className="timer-control-element-wrapper">
        <div
          id="start_stop"
          className="circle timer-control-element"
          onClick={startStop}
        >
          <i className="fas fa-play" />
          <i className="fas fa-pause" />
        </div>
      </div>
      <div className="timer-control-element-wrapper">
        <div
          id="reset"
          className="circle timer-control-element"
          onClick={reset}
        >
          <i className="fas fa-stop" />
        </div>
      </div>
    </div>
  );
};

TimerControl.propTypes = {
  startStop: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
};
