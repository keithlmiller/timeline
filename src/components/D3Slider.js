import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { throttle } from 'lodash';
import './Slider.scss';

function D3Slider({ start = 1600, end = 2020, onChange, width = 650, year }) {  
  const padding = {
    left: 30,
    right: 30,
  }

  const draggerWidth = 30;
  const draggerHeight = 70;

  const xAxisRef = useRef(null);
  const draggerRef = useRef(null);

  const [draggerX, setDraggerX] = useState(padding.left - (draggerWidth/2));
  const [currYear, setCurrYear] = useState(start);
  const [isPlaying, setIsPlaying] = useState(false);
  const [xScale, setXScale] = useState(null);

  useEffect(() => {
    let xScale = d3.scaleLinear()
      .domain([start, end])
      .range([padding.left, width - padding.right]);

      setXScale({ scale: xScale });
  }, [])

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  }

  const drag = useCallback(() => {
    function dragstarted(d) {
      d3.select(this).raise().attr('stroke', 'black');
    }
  
    function dragged(d) {
      throttle(() => setDraggerX(d3.event.x-(draggerWidth/2)), 128)()
    }

    function dragended(d) {
      d3.select(this).attr('stroke', null);
      setDraggerX(d3.event.x-(draggerWidth/2))
    }
  
    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
  }, [setDraggerX]);

  useEffect(() => {

    let interval = null;
    if (xScale) {
      const tick = xScale.scale(10) - xScale.scale(0);
      if (isPlaying) {
        interval = setInterval(() => {
          setDraggerX(draggerX + tick);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }
      return () => clearInterval(interval);
  }, [isPlaying, setDraggerX, draggerX, xScale])

  useEffect(() => {
    if (xScale) {
      let xAxis = d3.axisBottom()
        .scale(xScale.scale)
        .ticks((end - start) / 50)
        .tickSize(10)
        .tickFormat(d3.format('d'));

      const xAxisSelection = d3.select(xAxisRef.current);
      xAxisSelection
        .call(xAxis)
    }
  }, [start, end, width, padding, xScale])

  useEffect(() => {
    if (!year) {
      d3.select(draggerRef.current).call(drag());
    }
  }, [draggerRef, drag, year])

  useEffect(() => {
    if (xScale) {
      const year = Math.round(xScale.scale.invert(draggerX + (draggerWidth/2)));

      if (!(year % 10) || (year % 10 < Math.abs(year - currYear))) {
        if (year >= start && year <= end) {
          onChange(year)
          setCurrYear(year);
        }
      }
    }
  }, [draggerX, start, end, padding, width, onChange, currYear, xScale])

  return (
    <div className='slider-container'>
      <button onClick={togglePlayback}>Play/Pause</button>

      <svg width={width} height={60}>
        <g ref={xAxisRef} />
        <polygon 
          ref={draggerRef}
          points={`${draggerX+(draggerWidth/2)},0 ${draggerX+draggerWidth},${draggerHeight} ${draggerX},${draggerHeight}`} 
          class='dragger'
          fill={'#444'}
        />
      </svg>
    </div>
  );
}

export default D3Slider;