import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import './Slider.scss';

function D3Slider({ start = 1600, end = 2020, onChange, width = 650, year, steps = [] }) {  
  const padding = {
    left: 30,
    right: 140,
  }

  const draggerWidth = 30;
  const pointer = draggerWidth/2;
  const draggerHeight = 70;

  const xAxisRef = useRef(null);
  const draggerRef = useRef(null);

  const [draggerX, setDraggerX] = useState(padding.left - (draggerWidth/2));
  const [currYear, setCurrYear] = useState(start);
  const [isPlaying, setIsPlaying] = useState(false);
  const [xScale, setXScale] = useState(null);
  const [currStep, setCurrStep] = useState(0);
  const [stepMarkers, setStepMarkers] = useState([]);

  // set up scale for component-wide use
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
      placeDragger(d3.event.x);
    }

    function dragended(d) {
      d3.select(this).attr('stroke', null);

      placeDragger(d3.event.x);
    }

    function placeDragger(x) {
      const newX = x-pointer;

      if (newX >= pointer && newX <= width - padding.right) {
        setDraggerX(newX);
      } else if (newX <= pointer) {
        setDraggerX(pointer);
      } else if (newX >= width - padding.right  - pointer) {
        setDraggerX(width - padding.right - pointer);
      }
    }
  
    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
  }, [setDraggerX, pointer, width, padding]);


  useEffect(() => {
    let interval = null;
    if (xScale) {
      const tick = xScale.scale(10) - xScale.scale(0);

      if (isPlaying) {
        interval = setInterval(() => {
          if (steps.length) {
            if (currStep <= steps.length - 1) {
              setDraggerX(xScale.scale(steps[currStep] - (draggerWidth/2)));
              return setCurrStep(currStep+1)
            }
            clearInterval(interval);
            setCurrStep(0);
            setIsPlaying(false);
          }
          setDraggerX(draggerX + tick);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, setDraggerX, draggerX, xScale, currStep, steps])

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

  // call d3 drag
  useEffect(() => {
    if (!year) {
      d3.select(draggerRef.current).call(drag());
    }
  }, [draggerRef, drag, year])


  // as the xScale changes, convert that to a year value, and change the chart year if it changes decade
  useEffect(() => {
    if (xScale) {
      // maybe do this conversion in the dragged event so that this will react to year change
      let year = Math.round(xScale.scale.invert(draggerX + (draggerWidth/2)));
      if (year > end) year = end;

      const yearsPastDecade = year % 10;

      if (!(yearsPastDecade) || Math.abs(year - currYear) > 10 || (isPlaying && steps.length)) {
        if (year >= start && year <= end) {
          let newYear = year;

          if (yearsPastDecade && !(isPlaying && steps.length)) {
            const increment = year > currYear ? (year - currYear - 10) : year - currYear + 10;
            newYear = year - increment;
          }
          
          onChange(newYear)
          setCurrYear(newYear);
        }
      }
    }
  }, [draggerX, start, end, padding, width, onChange, currYear, xScale, steps])

  useEffect(() => {
    if (xScale) {
      const newStepMarkers = steps.map((step) => ({
        x: xScale.scale(step),
        label: step,
      }))
      setStepMarkers(newStepMarkers);
    }
  }, [steps, xScale])

  return (
    <div className='slider-container'>
      <button onClick={togglePlayback}>Play/Pause</button>

      <svg width={width} height={60}>
      <g>
            {stepMarkers.map(d => (
              <React.Fragment>
                <rect
                    className='step-marker'
                    x={d.x-2} y={0} height={20}
                    width={3}

                    // onMouseOver={() => onDataHover(d.title)}
                    // onMouseOut={() => onDataHover()}
                    // onClick={() => onDataClick(d.title)}
                    // clip-path='url(#chart-clip-path)'
                  />
                <text 
                  className='step-label'
                  x={d.x - 20} y={35}
                  font-size='12px'
                >{d3.format('d')(d.label)}</text>
              </React.Fragment>
            ))}
          </g>
        <g ref={xAxisRef} />
        <polygon 
          ref={draggerRef}
          points={`${draggerX+(draggerWidth/2)},0 ${draggerX+draggerWidth},${draggerHeight} ${draggerX},${draggerHeight}`} 
          className='dragger'
          fill={'#444'}
        />
      </svg>
    </div>
  );
}

export default D3Slider;