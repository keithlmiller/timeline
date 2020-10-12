import React, { useState } from 'react';

function TimeRange({
  startYear,
  endYear,
  title,
  description, 
  fill, 
  onHover = () => {}, 
  lane, 
  hasPermLabel,
  scale
}) {
  const [showFullInfo, setShowFullInfo] = useState(false);
  // const [isHovered, setIsHovered] = useState(false);

  const width = 20;
  const padding = 5;
  const x = (lane-1) * (width+padding)
  const y = scale(startYear)
  const handleMouseOver = () => {
    setShowFullInfo(true);

    onHover();
  }

  const handleMouseOut = () => {
    // setShowFullInfo(false);
  }

  return (
    <React.Fragment>
      <rect
        width={width}
        height={scale(endYear) - scale(startYear)}
        x={x}
        y={y}
        {...(fill && {fill})}
        {...(onHover && onHover)}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      ></rect>)

      {hasPermLabel && 
      <> 
        <rect
          width={70}
          height={30}
          fill='#fff'
          x={x+16} y={y+20}
          stroke='black'
        ></rect>
        <text 
          className='permanent-label'
          x={x+24} y={y+40}
          fontSize='14px'
        >
          {title}
        </text>
      </>}

      {/* {showFullInfo && description && <text 
        className='permanent-label'
        x={x+4} y={y+60}
        fontSize='14px'
        // transform='rotate(-90)'
      >{description}</text>} */}

      {showFullInfo && description && <div 
        className='range-description'
        style={{ transform: `translate(${x+4}, ${y+60})`, width: '60px'}}
      >{description}</div>}
    </React.Fragment>
  );
}

export default TimeRange;