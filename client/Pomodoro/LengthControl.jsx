import React from 'react';
import PropTypes from 'prop-types';

export const LengthControl = ({ name, length, increment, decrement }) => {
  return (
    <section className="length-control-block">
      <p id={`${name}-label`} className="length-control-label">
        {name.toUpperCase()}
      </p>
      <p id={`${name}-length`} className="length-control-length">
        {length}
      </p>
      <div className="length-control-button-wrapper">
        <div
          id={`${name}-decrement`}
          className="circle length-control-button"
          onClick={decrement}
        >
          <i className="fas fa-minus fa-xs" />
        </div>
      </div>
      <div className="length-control-button-wrapper">
        <div
          id={`${name}-increment`}
          className="circle length-control-button"
          onClick={increment}
        >
          <i className="fas fa-plus fa-xs" />
        </div>
      </div>
    </section>
  );
};

LengthControl.propTypes = {
  name: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired
};
