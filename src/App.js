import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import Odometer from 'react-odometerjs';
import cityPopulations from './data/city-populations.csv';
import historyData from './data/entries.json'
import timeRanges from './data/timeRanges';
import VerticalSlider from './components/VerticalSlider';
import { useScrollPosition, usePrevious } from './utils/hooks'
import './App.scss';
import './odometerTheme.scss'

function App() {
  const top_n = 10;
  const startYear = 1600;
  const endYear = 2020;
  const chartHeight = 600;
  const chartWidth = 900;
  const barHeight = 30;

  const margin = {
    top: 50,
    right: 80,
    bottom: 5,
    left: 30
  };

  const contentRef = useRef(null)
  const currentYearRef = useRef(null);

  const [currentYear, setCurrentYear] = useState(startYear);
  const prevYear = usePrevious(currentYear);
  const [bars, setBars] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollRange, setScrollRange] = useState([0,0]);
  const [dataIndex, setDataIndex] = useState(0)
const [od, setOd] = useState({});

  // useLayoutEffect(() => {
  //   const odo = new Odometer({
  //     el: currentYearRef.current,
  //     value: prevYear,
    
  //     // Any option (other than auto and selector) can be passed in here
  //     format: '',
  //     theme: 'digital'
  //   });
  //   setOd(odo)

  // }, [setOd, prevYear])
  

  useScrollPosition(({ prevPos, currPos }) => {
    setScrollPos(currPos.y)
  }, [], contentRef, false, 100)


  useEffect(() => {
    if (contentRef) {
      setScrollRange([0, contentRef.current.scrollHeight])
    }
  }, [contentRef])

  useEffect(() => {
    if (currentYearRef && currentYear) {
      
    }
    

  }, [currentYear, currentYearRef, prevYear])

  useEffect(() => {
    const entryHeight = scrollRange[1] / historyData.entries.length;
    const entryPos = Math.round(scrollPos / entryHeight)
    const entryYear = historyData.entries[entryPos] ? historyData.entries[entryPos].year : historyData.entries[0].year;

    setCurrentYear(entryYear);
    setDataIndex(entryPos);
  }, [scrollRange, scrollPos])

  const onMarkerClick = (i) => {
    const entryHeight = scrollRange[1] / historyData.entries.length;

    contentRef.current.scrollTop = (entryHeight - 1) * i;
  }

  return (
    <div className='app-container'>
      <div className='timeline'>
        <VerticalSlider
          start={startYear} 
          end={endYear} 
          width={200}
          {...((contentRef && contentRef.current) && {height: contentRef.current.clientHeight - 40})}
          onMarkerClick={onMarkerClick}
          steps={historyData.entries.map((entry) => (entry.year))} 
          timeRanges={timeRanges}
          showSteps={true}
          year={currentYear}
        />
      </div>

      <div ref={contentRef} className='primary-content'>
        <div className='primary-header'>
          <h4>Year: <span className='currentYear' ref={currentYearRef}>{currentYear}</span></h4>
          {/* <h4>Year: <Odometer value={currentYear} format="(dddd)" /></h4> */}
          
          {/* <h3>Race in America history timeline</h3>
          <h6>https://www.instagram.com/p/CB0qUjklwQm/</h6> */}
        </div>

        <div className='scroll-content'>
          {historyData.entries.map((entry) => (<div className='history-event'>
            <h4>{entry.year}</h4>
            <p>{entry.content}</p>
          </div>))}
        </div>
      </div>
    </div>
  );
}

export default App;
