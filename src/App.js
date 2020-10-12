import React, { useEffect, useState, useRef } from 'react';
import historyData from './data/entries.json'
import timeRanges from './data/timeRanges';
import VerticalSlider from './components/VerticalSlider';
import { useScrollPosition } from './utils/hooks'
import './App.scss';

function App() {
  const startYear = 1600;
  const endYear = 2020;

  const contentRef = useRef(null)

  const [currentYear, setCurrentYear] = useState(startYear);
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollRange, setScrollRange] = useState([0,0]);

  useScrollPosition(({ currPos }) => {
    setScrollPos(currPos.y)
  }, [], contentRef, false, 100)


  useEffect(() => {
    if (contentRef) {
      setScrollRange([0, contentRef.current.scrollHeight])
    }
  }, [contentRef])

  useEffect(() => {
    const entryHeight = scrollRange[1] / historyData.entries.length;
    const entryPos = Math.round(scrollPos / entryHeight)
    const entryYear = historyData.entries[entryPos] ? historyData.entries[entryPos].year : historyData.entries[0].year;

    setCurrentYear(entryYear);
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
          width={240}
          {...((contentRef && contentRef.current) && {height: contentRef.current.clientHeight - 10})}
          onMarkerClick={onMarkerClick}
          steps={historyData.entries.map((entry) => (entry.year))} 
          timeRanges={timeRanges}
          showSteps={true}
          year={currentYear}
        />
      </div>

      <div ref={contentRef} className='primary-content'>
        <div className='primary-header'>
          {/* <h4>Year: <Odometer value={currentYear} format="(dddd)" /></h4> */}
          <h1>Placeholder title</h1>
          
          {/* <h3>Race in America history timeline</h3>
          <h6>https://www.instagram.com/p/CB0qUjklwQm/</h6> */}
        </div>

        <div className='scroll-content'>
          {historyData.entries.map((entry) => (<div className='history-event'>
            <h2>{entry.year}</h2>
            <p>{entry.content}</p>
          </div>))}
        </div>
      </div>
    </div>
  );
}

export default App;
