import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import './Slider.scss';

function D3Slider({ start = 1600, end = 2020, onChange, width = 650, year, steps = [], yearJump = 10 }) {  
  const padding = {
    left: 30,
    right: 140,
  }

  const draggerWidth = 30;
  const draggerHeight = 70;

  const xAxisRef = useRef(null);
  const draggerRef = useRef(null);

  const [tempX, setTempX] = useState(padding.left)
  const [draggerX, setDraggerX] = useState(padding.left);
  const [currYear, setCurrYear] = useState(start);
  const [isPlaying, setIsPlaying] = useState(false);
  const [xScale, setXScale] = useState(null);
  const [currStep, setCurrStep] = useState(0);
  const [stepMarkers, setStepMarkers] = useState([]);
  const [tick, setTick] = useState(10);

  // set up scale for component-wide use
  useEffect(() => {
    let xScale = d3.scaleLinear()
      .domain([start, end])
      .range([padding.left, width - padding.right]);

      setTick(xScale(yearJump) - xScale(0));
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
      if (x >= padding.left && x <= width - padding.right) {
        setTempX(x);
      } else if (x <= padding.left) {
        setTempX(padding.left);
      } else if (x >= width - padding.right) {
        setTempX(width - padding.right);
      }
    }
  
    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
  }, [setTempX, width, padding]);


  useEffect(() => {
    let interval = null;

    if (xScale) {
      if (isPlaying) {
        interval = setInterval(() => {
          if (steps.length) {
            if (currStep <= steps.length - 1) {
              setDraggerX(xScale.scale(steps[currStep]));
              onChange(steps[currStep])

              return setCurrStep(currStep+1)
            }
            clearInterval(interval);
            setCurrStep(0);
            return setIsPlaying(false);
          }
          setDraggerX(draggerX + tick);
          setTempX(draggerX + tick);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, setDraggerX, draggerX, xScale, currStep, steps, tick, onChange])

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
  // useEffect(() => {
  //   if (xScale) {
  //     // maybe do this conversion in the dragged event so that this will react to year change
  //     let year = Math.round(xScale.scale.invert(draggerX));
  //     if (year > end) year = end;

  //     const yearsPastDecade = year % 10;

  //     if (!(yearsPastDecade) || Math.abs(year - currYear) > 10 || (isPlaying && steps.length)) {
  //       if (year >= start && year <= end) {
  //         let newYear = year;

  //         if (yearsPastDecade && !(isPlaying && steps.length)) {
  //           const increment = year > currYear ? (year - currYear - 10) : year - currYear + 10;
  //           newYear = year - increment;
  //         }
          
  //         onChange(newYear)
  //         setCurrYear(newYear);
  //       }
  //     }
  //   }
  // }, [draggerX, start, end, padding, width, onChange, currYear, xScale, steps])

  useEffect(() => {
    if (xScale && !(steps.length && isPlaying)) {
      const remainder = tempX - draggerX;

      if (remainder > 7) {
        setDraggerX(draggerX + tick)
      } else if (remainder < -7) {
        setDraggerX(draggerX - tick)
      } else if (!isPlaying){
        return;
      }
      const newYear = Math.round(xScale.scale.invert(draggerX));
      onChange(newYear)
    }
  }, [draggerX, tick, tempX, xScale, onChange, isPlaying, steps])

  useEffect(() => {
    if (xScale && steps.length) {
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
          transform={`translate(${-(draggerWidth/2)}, 0)`}
        />
      </svg>
    </div>
  );
}

export default D3Slider;