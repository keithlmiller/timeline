import React from 'react';
import * as d3 from 'd3';

function Dragger({
  version,
  handleMarkerClick, 
  label = '',
  y,
  index,
}) {
  const draggerWidth = 70;
  const draggerHeight = 30;
let dragger = <rect height={10} width={10} />
console.log('dragger label', label)
  switch (version) {
    case 'v1': 
      dragger = (<polygon 
        className='dragger'
        points={`0,${y} ${draggerWidth},${y-draggerHeight/2} ${draggerWidth},${y + draggerHeight/2}`} 
        fill={'#444'}
        transform={`translate(30, 0)`}
      />)
      break;
    case 'v2': 
      dragger = (
        <>
          <rect 
            width={draggerWidth} 
            height={draggerHeight} 
            y={y-(draggerHeight/2)} 
            fill='#f1f1f1' stroke='#444' 
            transform={`translate(30, 0)`}
          />

          <text 
            className='dragger-label'
            x={40} y={y+3}
            font-size='12px'
          >{d3.format('d')(label)}</text>
      
          <polygon 
            className='dragger'
            points={`${draggerWidth * .75},${y} ${draggerWidth},${y-draggerHeight/4} ${draggerWidth},${y + draggerHeight/4}`} 
            fill={'#444'}
            transform={`translate(30, 0)`}
          />
        </>
      )
    break;
    default: break;
  }


  return (dragger);
}

export default Dragger;