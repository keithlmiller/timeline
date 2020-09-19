import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import cityPopulations from './data/city-populations.csv';
import historyData from './data/entries.json'
import timeRanges from './data/timeRanges';
import VerticalSlider from './components/VerticalSlider';
import { useScrollPosition } from './utils/hooks'
import './App.scss';

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

  const [currentYear, setCurrentYear] = useState(startYear);
  const [bars, setBars] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollRange, setScrollRange] = useState([0,0]);

  useScrollPosition(({ prevPos, currPos }) => {
    setScrollPos(currPos.y)
  }, [], contentRef, false, 100)


  useEffect(() => {
    if (contentRef) {
      console.log('contentRef.current.clientHeight', contentRef.current.clientHeight)
      setScrollRange([0, contentRef.current.scrollHeight - contentRef.current.clientHeight])
    }
  }, [contentRef])

  useEffect(() => {
    const entryHeight = scrollRange[1] / historyData.entries.length;
    const entryPos = Math.floor(scrollPos / entryHeight)
    const entryYear = historyData.entries[entryPos] ? historyData.entries[entryPos].year : historyData.entries[0].year;

    setCurrentYear(entryYear);
  }, [scrollRange, scrollPos])

  const onMarkerClick = (i) => {
    const entryHeight = scrollRange[1] / historyData.entries.length;

    console.log('onMarkerClick i', i)
    contentRef.current.scrollTop = entryHeight * i + 5;
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
          <h4>Year: {currentYear}</h4>
        </div>

        <div className='scroll-content'>
          <h3>Race in America history timeline</h3>
          <h6>https://www.instagram.com/p/CB0qUjklwQm/</h6>

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
