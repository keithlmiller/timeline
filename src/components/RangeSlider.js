import React from 'react';
import { throttle } from 'lodash';
import './Slider.scss';

function RangeSlider({start, end, onChange, step}) {

  const handleChange = (e) => {
    throttle(() => onChange(e.target.value), 128)()
  }

  return (
    <div className='slider-container'>
      <span className='slider-year'>{start}</span>
      <input className='range-slider' type='range' step={step} min={start} max={end} onChange={handleChange}></input>
      <span className='slider-year'>{end}</span>
    </div>
  );
}

export default RangeSlider;