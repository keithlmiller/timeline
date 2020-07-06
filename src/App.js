import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import cityPopulations from './data/city-populations.csv';
import { continents } from './data/constants';
import D3Slider from './components/D3Slider';

import './App.css';

function App() {
  const top_n = 10;
  const startYear = 1500;
  const endYear = 2018;
  const chartHeight = 600;
  const chartWidth = 900;
  const barHeight = 30;

  const margin = {
    top: 50,
    right: 80,
    bottom: 5,
    left: 30
  };

  const xAxisRef = useRef(null);
  const barsRef = useRef(null);

  const [cityData, setCityData] = useState([]);
  const [currentYear, setCurrentYear] = useState(startYear);
  const [bars, setBars] = useState([]);

  // Example city year
  // group: "India"
  // lastValue: "204"
  // lat: "23.039568"
  // lon: "72.566004"
  // name: "Ahmedabad"
  // subGroup: "India"
  // value: "206"
  // year: "1608"

  useEffect(() => {
    d3.csv(cityPopulations, (cityYear) => ({
      lastValue: +cityYear.lastValue,
      value: isNaN(cityYear.value) ? 0 : +cityYear.value,
      year: +cityYear.year,
      color: d3.hsl(Math.random()*360,0.75,0.75),
      name: cityYear.name,
      group: cityYear.group,
    })).then(data => { 
      setCityData(data);
    });
  }, [])


  useEffect(() => {
    if (cityData.length) {
      let year = +currentYear;

      let yearSlice = cityData.filter(d => d.year === year && !isNaN(d.value))
        .sort((a,b) => b.value - a.value)
        .slice(0,top_n);
      
      yearSlice.forEach((d,i) => d.rank = i);

      const cities = yearSlice.map(city => city.rank);
      const yScale = d3
        .scaleBand()
        .domain(cities)
        .range([margin.top, chartHeight - margin.bottom])
        .paddingInner(.35)
        .paddingOuter(.25);

      let xScale = d3.scaleLinear()
        .domain([0, d3.max(yearSlice, d => d.value)])
        .range([0, chartWidth-margin.right-margin.left]);
      
      let colourScale = d3.scaleOrdinal()
        .range(["#adb0ff", "#ffb3ff", "#90d595", "#e48381", "#aafbff", "#f7bb5f", "#eafb50"])
        .domain(continents);

      const yearBars = yearSlice.map(d => {
        return {
          x: margin.left,
          y: yScale(d.rank),
          width: xScale(d.value),
          height: barHeight,
          name: d.name,
          value: d3.format(',')(Math.floor(d.value * 1000)),
          fill: colourScale(d.group),
        };
      });

      setBars(yearBars)

      let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(chartWidth > 500 ? 5 : 2)
        .tickSize(15)
        .tickFormat(d => d3.format(',')(Math.floor(d * 1000)));

      const xAxisSelection = d3.select(xAxisRef.current);
      xAxisSelection
        .call(xAxis)
    }
  }, [cityData, currentYear, margin.bottom, margin.top, margin.left, margin.right])

  return (
    <div className="app-container">
      <h4>Year: {currentYear}</h4>
      <a href={`https://en.wikipedia.org/wiki/${currentYear}s`} rel='noreferrer' target='_blank' >Learn about the world of the {currentYear}s decade</a>
      <svg width={chartWidth} height={chartHeight}>
        <g ref={xAxisRef} transform={`translate(${margin.left}, 0)`} />
        <g ref={barsRef}>
          {bars.map(d => (
              <>
              <rect
                x={d.x} y={d.y} 
                width={d.width} 
                height={d.height}
                fill={d.fill}
              />
              <text x={d.x + d.width} y={d.y} className='bar-value'>{d.name}</text>
              <text x={d.x} y={d.y+20} className='bar-value'>Population: {d.value}</text>
              </>
          ))}
        </g>
      </svg>

      {/* <RangeSlider start={startYear} end={endYear} onChange={setCurrentYear} step={10} /> */}

      <D3Slider start={startYear} end={endYear} width={900} onChange={setCurrentYear} />
    </div>
  );
}

export default App;
