import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { throttle } from 'lodash';
import './Slider.scss';

function D3Slider({start = 1600, end = 2020, onChange, width = 650 }) {  
  const padding = {
    left: 30,
    right: 30,
  }

  const draggerWidth = 30;

  const xAxisRef = useRef(null);
  const draggerRef = useRef(null);

  const [draggerX, setDraggerX] = useState(padding.left - (draggerWidth/2));

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
    let xScale = d3.scaleLinear()
      .domain([start, end])
      .range([padding.left, width - padding.right]);

    let xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks((end - start) / 50)
      .tickSize(10)
      .tickFormat(d3.format('d'));

    const xAxisSelection = d3.select(xAxisRef.current);
    xAxisSelection
      .call(xAxis)

  }, [start, end, width, padding])

  useEffect(() => {
    d3.select(draggerRef.current).call(drag());
  }, [draggerRef, drag])

  useEffect(() => {
    let xScale = d3.scaleLinear()
      .domain([start, end])
      .range([padding.left, width - padding.right]);

    const year = Math.round(xScale.invert(draggerX));
    if (!(year % 10)) {
      if (year >= start && year <= end) {
        onChange(year)
      }
    }

  }, [draggerX, start, end, padding, width, onChange])

  return (
    <div className='slider-container'>

      <svg width={width} height={60}>
        <g ref={xAxisRef} />
        <polygon 
          ref={draggerRef}
          points={`${draggerX+(draggerWidth/2)},0 ${draggerX+draggerWidth},30 ${draggerX},30`} 
          class='dragger'
          fill={'#444'}
        />
      </svg>
    </div>
  );
}

export default D3Slider;