import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Marker from './svg/TimelineMarker';
import Dragger from './svg/Dragger';
import TimeRange from './svg/RangeRect';
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
    left: 40,
    right: 140,
    top: 20,
    bottom: 20,
  }


  // const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const decadeAxisRef = useRef(null);
  const centuryAxisRef = useRef(null);

  // const [tempX, setTempX] = useState(padding.left)
  const [draggerY, setDraggerY] = useState(padding.top);
  const [isPlaying, setIsPlaying] = useState(false);
  const [yScale, setYScale] = useState(null);
  const [currStep, setCurrStep] = useState(0);
  const [stepMarkers, setStepMarkers] = useState([]);
  const [tick, setTick] = useState(10);
  // eslint-disable-next-line
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
          // setTempX(draggerY + tick);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, setDraggerY, draggerY, yScale, currStep, steps, allSteps, tick, onChange])

  useEffect(() => {
    if (yScale) {
      const yAxis = d3.axisRight()
        .scale(yScale.scale)
        .ticks((end - start) / 50)
        .tickSize(15)
        .tickFormat(d3.format('d'));

      const decadeAxis = d3.axisRight()
        .scale(yScale.scale)
        .ticks((end - start) / 10)
        .tickSize(5)
        .tickFormat(d3.format('d'))

      const centuryAxis = d3.axisRight()
        .scale(yScale.scale)
        .ticks((end - start) / 100)
        .tickSize(25)
        .tickFormat(d3.format('d')); 

      const yAxisSelection = d3.select(yAxisRef.current);
      yAxisSelection
        .call(yAxis)
        .selectAll('text').remove()

      const decadeAxisSelection = d3.select(decadeAxisRef.current);
      decadeAxisSelection
        .call(decadeAxis)
        .call(g => g.select('.domain').remove())
        .selectAll('text').remove()

      const centuryAxisSelection = d3.select(centuryAxisRef.current);
      centuryAxisSelection
        .call(centuryAxis)
        .call(g => g.select('.domain').remove())
        // .selectAll('text').remove()

        
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
          x={padding.left}
          active={d.label === year}
        />
      ))}
    </g>
  );

  return (
    <div className='slider-container'>
      <div className='timeRanges'>
        <svg width={width/2} height={height}>
        {yScale && timeRanges.map(range => (
          <TimeRange 
            startYear={range.start}
            endYear={range.end}
            title={range.shortTitle}
            description={range.description}
            fill={range.fill}
            onHover={handleTimeRangeHover}
            lane={range.lane}
            hasPermLabel={range.hasPermLabel} 
            scale={yScale.scale}
          />))}
        </svg>
      </div>
      <div className='slider'>
        <svg width={width/2} height={height}>
          <g class='yAxis' ref={yAxisRef} transform={`translate(${padding.left}, 0)`}/>

          <g class='yAxis decadeAxis' ref={decadeAxisRef} transform={`translate(${padding.left}, 0)`}/>
          <g class='yAxis centuryAxisRef' ref={centuryAxisRef} transform={`translate(${padding.left}, 0)`}/>

          <Dragger 
            y={draggerY}
            version='v5'
            label={year}
            transformLeft={padding.left}
          />
          
          {showSteps && makeStepMarkers()}
        </svg>
      </div>
      
    </div>
  ); 
}

export default VerticalSlider;