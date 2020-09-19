import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

function Marker({
  handleMarkerClick, 
  y,
  index,
  label
}) {
  const [showLabel, setShowLabel] = useState(false);
  // useEffect(() => {

  // }, [])

  return (
    <React.Fragment>
      <circle
        className='step-marker'
        cx='30' cy={y-1} r={4}
        onClick={() => handleMarkerClick(index)}
        fill='red'
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      />
      {/* <rect
          className='step-marker'
          x={30} y={d.y-2} height={3}
          width={20}

          // onMouseOver={() => onDataHover(d.title)}
          // onMouseOut={() => onDataHover()}
          // clip-path='url(#chart-clip-path)'
        /> */}

      {showLabel && <text 
        className='step-label'
        x={35} y={y+3}
        font-size='12px'
      >{d3.format('d')(label)}</text>}
    </React.Fragment>
  );
}

export default Marker;