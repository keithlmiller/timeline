import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import Marker from './svg/TimelineMarker';
import Dragger from './svg/Dragger';
import './Slider.scss';

function VerticalSlider({ 
  start = 1600, 
  end = 2020, 
  onChange, 
  width = 200, 
  height = 600, 
  year, 
  steps = [],
  showSteps = true, 
  yearJump = 10, 
  orientation = 'horizontal',
  onMarkerClick = () => {},
  scrollPos = 0,
  scrollRange = [0, 0],
  timeRanges = [],
}) {  
  const padding = {
    left: 30,
    right: 140,
    top: 20,
    bottom: 20,
  }

  const draggerWidth = 70;
  const draggerHeight = 30;

  // const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const draggerRef = useRef(null);

  const [tempX, setTempX] = useState(padding.left)
  const [draggerY, setDraggerY] = useState(padding.left);
  const [isPlaying, setIsPlaying] = useState(false);
  const [yScale, setYScale] = useState(null);
  const [currStep, setCurrStep] = useState(0);
  const [stepMarkers, setStepMarkers] = useState([]);
  const [tick, setTick] = useState(10);
  const [allSteps, setAllSteps] = useState([start, ...steps, end])

  // set up scale for component-wide use
  useEffect(() => {
    let yScale = d3.scaleLinear()
      .domain([start, end])
      .range([padding.top, height - padding.bottom]);

      setTick(yScale(yearJump) - yScale(0));
      setYScale({ scale: yScale });
  }, [height])

  
useEffect(() => {
  let scale = d3.scaleLinear()
    .domain(scrollRange)
    .range([padding.top, height - padding.bottom]);

    if (!year) {
      const newYPos = scale(scrollPos)
      setDraggerY(newYPos)
    } else {
      if (yScale) {
        const newYPos = yScale.scale(year);
        setDraggerY(newYPos)
      }
    }

    
}, [scrollPos, scrollRange, yScale, year, height, padding])

  const togglePlayback = () => {
    if (!isPlaying) {
      setCurrStep(0);
    }
    setIsPlaying(!isPlaying);
  }

  const handleReset = () => {
    setIsPlaying(false);
    setDraggerY(padding.left);
    setTempX(padding.left)
    onChange(start);
    setCurrStep(0);
  }

  const handleNext = () => {
    advanceToStep(currStep + 1);
    setCurrStep(currStep + 1);
  }

  const handleBack = () => {
    if (currStep === 0) {
      return handleReset();
    }
    advanceToStep(currStep - 1);
    setCurrStep(currStep - 1);
  }

  function advanceToStep(newStep) {
    const newX = yScale.scale(allSteps[newStep]);
    setDraggerY(newX);
    setTempX(newX)
    onChange(allSteps[newStep])
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

  const handleTimeRangeHover = (title) => {
    if (title) {
      console.log('handleTimeRangeHover', title)
    }
  }

  useEffect(() => {
    let interval = null;

    if (yScale) {
      if (isPlaying) {
        interval = setInterval(() => {
          if (steps.length) {
            if (currStep <= allSteps.length - 1) {
              setDraggerY(yScale.scale(allSteps[currStep]));
              onChange(allSteps[currStep])

              return setCurrStep(currStep+1)
            }
            clearInterval(interval);
            setCurrStep(0);

            return setIsPlaying(false);
          }
          setDraggerY(draggerY + tick);
          setTempX(draggerY + tick);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, setDraggerY, draggerY, yScale, currStep, steps, allSteps, tick, onChange])

  useEffect(() => {
    if (yScale) {
      let yAxis = d3.axisRight()
        .scale(yScale.scale)
        .ticks((end - start) / 50)
        .tickSize(10)
        .tickFormat(d3.format('d'));

      const yAxisSelection = d3.select(yAxisRef.current);
      yAxisSelection
        .call(yAxis)
    }
  }, [start, end, width, padding, yScale])

  // useEffect(() => {
  //   if (yScale && !(steps.length && isPlaying)) {
  //     const remainder = tempX - draggerY;

  //     if (remainder > tick*.5) {
  //       setDraggerY(draggerY + tick)
  //     } else if (remainder < -(tick*.5)) {
  //       setDraggerY(draggerY - tick)
  //     } else if (!isPlaying){
  //       return;
  //     }
  //     const newYear = Math.round(yScale.scale.invert(draggerY));
  //     onChange(newYear)
  //   }
  // }, [draggerY, tick, tempX, yScale, onChange, isPlaying, steps])

  useEffect(() => {
    if (yScale && steps.length) {
      const newStepMarkers = steps.map((step) => ({
        y: yScale.scale(step),
        label: step,
      }))
      setStepMarkers(newStepMarkers);
    }
  }, [steps, yScale])

  const handleMarkerClick = (i) => {
    onMarkerClick(i);
  }

  useEffect(() => {
    // console.log('draggerY', draggerY)
  }, [draggerY])

  const makeStepMarkers = () => (
    <g className='markers'>
      {stepMarkers.map((d, i) => (
        <Marker
          y={d.y}
          handleMarkerClick={handleMarkerClick}
          label={d.label}
          index={i}
        />
        // <React.Fragment>
        //   <circle
        //     className='step-marker'
        //     cx='30' cy={d.y-1} r={4}
        //     onClick={() => handleMarkerClick(i)}
        //     fill='red'
        //   />
        //   {/* <rect
        //       className='step-marker'
        //       x={30} y={d.y-2} height={3}
        //       width={20}

        //       // onMouseOver={() => onDataHover(d.title)}
        //       // onMouseOut={() => onDataHover()}
        //       // clip-path='url(#chart-clip-path)'
        //     /> */}

        //   {/* <text 
        //     className='step-label'
        //     x={58} y={d.y}
        //     font-size='12px'
        //   >{d3.format('d')(d.label)}</text> */}
        // </React.Fragment>
      ))}
    </g>
  );
  
  const makeRangeRect = ([startYear, endYear], { title, fill, onHover }) => {
    return (<rect
      width='20'
      height={yScale.scale(endYear) - yScale.scale(startYear)}
      y={yScale.scale(startYear)}
      {...(fill && {fill})}
      {...(onHover && onHover)}
      onMouseOver={() => onHover(title)}
      onMouseOut={() => onHover()}
    ></rect>)
  }

  return (
    <div className='slider-container'>
      {/* <div className='controls'>
        <button onClick={togglePlayback}>Play/Pause</button>
        <button onClick={handleReset}>Reset</button>
        <button disabled={!!(currStep === 0)} onClick={handleBack}>Back</button>
        <button disabled={!!(currStep === allSteps.length - 1)} onClick={handleNext}>Next</button>
      </div> */}
      
      <div className='slider'>
        <svg width={width} height={height}>
          {/* {orientation === 'horizontal' && makeStepMarkers()} */}

          {yScale && timeRanges.map(range => (makeRangeRect([range.start, range.end], {title: range.shortTitle, fill: range.fill, onHover: handleTimeRangeHover}, ))) }
          

          <g class='yAxis' ref={yAxisRef} transform='translate(30, 0)'/>

          <Dragger 
            y={draggerY}
            version='v2'
            label={year}
          />
          {showSteps && makeStepMarkers()}

        </svg>
      </div>
      
    </div>
  ); 
}

export default VerticalSlider;