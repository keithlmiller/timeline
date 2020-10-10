import React, { useState } from 'react';
import { motion } from "framer-motion"
import * as d3 from 'd3';

function Marker({
  active,
  handleMarkerClick,
  index,
  label,
  x,
  y,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <React.Fragment>
      <circle
        className={`step-marker ${active ? 'active-marker' : ''}`}
        cx={x} cy={y-1} 
        r={isHovered ? 3 : 4}
        onClick={() => handleMarkerClick(index)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      <motion.circle
        className={`step-marker ${active ? 'active-marker' : ''}`}
        cx={x} cy={y-1} 
        r={isHovered ? 8 : 4}
        opacity={isHovered ? .5 : 1}
        onClick={() => handleMarkerClick(index)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />  
      {/* <rect
          className='step-marker'
          x={30} y={d.y-2} height={3}
          width={20}

          // onMouseOver={() => onDataHover(d.title)}
          // onMouseOut={() => onDataHover()}
          // clip-path='url(#chart-clip-path)'
        /> */}

      {isHovered && <text 
        className='step-label'
        x={x-35} y={y+3}
        fontSize='12px'
      >{d3.format('d')(label)}</text>}
    </React.Fragment>
  );
}

export default Marker;