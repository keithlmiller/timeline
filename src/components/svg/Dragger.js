import React from 'react';
import * as d3 from 'd3';
import { motion } from "framer-motion"

function Dragger({
  version,
  handleMarkerClick, 
  label = '',
  y,
  transformLeft,
  index,
}) {
  let draggerWidth = 70;
  let draggerHeight = 40;

const transition = { ease: "easeIn", duration: .3 };
  
let dragger = <rect height={10} width={10} />
  switch (version) {
    case 'v1': 
      dragger = (<motion.polygon 
        className='dragger'
        points={`0,${y} ${draggerWidth},${y-draggerHeight/2} ${draggerWidth},${y + draggerHeight/2}`} 
        fill={'#444'}
        transform={`translate(${transformLeft}, 0)`}
      />)
      break;
    case 'v2': 
      dragger = (
        <>
          <motion.rect 
            width={draggerWidth} 
            height={draggerHeight} 
            // y={y-(draggerHeight/2)} 
            fill='#f1f1f1' stroke='#444' 
            transform={`translate(${transformLeft}, 0)`}
            animate={{
              y: y-(draggerHeight/2),
            }}
            transition={transition}
          />

          <motion.text 
            className='dragger-label'
            x={transformLeft}
            animate={{
              y: y+4,
            }}
            transition={transition}
            fontSize='12px'
          >{d3.format('d')(label)}</motion.text>
      
          {/* <polygon 
            className='dragger'
            points={`${draggerWidth * .75},${y} ${draggerWidth},${y-draggerHeight/4} ${draggerWidth},${y + draggerHeight/4}`} 
            fill={'#444'}
            transform={`translate(${transformLeft}, 0)`}
          /> */}
        </>
      )
    break;
    case 'v3': 
      dragger = y ? (
      <>
        <motion.path 
          stroke="null" 
          fill="#1D1D1D" 
          d="m56.78668,2.54709c-1.31274,-1.44524 -3.50064,-2.38039 -5.9438,-2.38039l-40.1115,0.02834c-4.01115,0 -7.293,2.52208 -7.293,5.63925l0,28.33796c0,3.11718 3.28185,5.63925 7.293,5.63925l40.1115,0.02834c2.44316,0 4.63106,-0.93515 5.9438,-2.38039l14.44014,-15.81258c0.91163,-0.99183 0.91163,-2.29537 0,-3.2872l-14.44014,-15.81258z"
          // d="m56.6403,3.51579c-1.29186,-1.34405 -3.44496,-2.21373 -5.84925,-2.21373l-39.47349,0.02635c-3.94735,0 -7.177,2.3455 -7.177,5.24442l0,26.35389c0,2.89893 3.22965,5.24442 7.177,5.24442l39.47349,0.02635c2.40429,0 4.55739,-0.86968 5.84925,-2.21373l14.21045,-14.70547c0.89712,-0.92239 0.89712,-2.13467 0,-3.05705l-14.21045,-14.70547z"
          animate={{
            translateY: y-(draggerHeight/2),
            translateX: 10,
          }}
          style={{ rotate: 180 }}
          initial={false}
          transition={transition}
        />
        <motion.text 
          className='dragger-label'
          x={transformLeft}
          animate={{
            y: y+4,
          }}
          fill='#f1f1f1'
          transition={transition}
          fontSize='12px'
        >{d3.format('d')(label)}</motion.text>
      </>
      ) : null;
      break;



      case 'v4':
        dragger = y ? (
          <>
            <motion.path 
              d="m0.64189,0.62003l68.62557,-0.11139l0,28.99028l-58.38102,-0.2543l0,-20.34405l-10.24455,-8.28053z" 
              stroke-width="1.5" 
              fill="#494949"
              style={{ translateX: transformLeft }}
              animate={{
                translateY: y-3,
              }}
              transition={transition}
              initial={false}
            />
            <motion.text 
              className='dragger-label'
              x={transformLeft}
              style={{ x: 22 }}
              animate={{
                y: y+18,
              }}
              transition={transition}
              initial={false}
              fill='#f1f1f1'
              fontSize='14px'
            >{d3.format('d')(label)}</motion.text>
          </>
        ) : null;
      break;
      case 'v5':
        dragger = y ? (
          <>
            <motion.path 
              d="m-68.033-66.844h139.03v97.844h-139.03l-0.25014-29.916-19.501-20.45 18.822-20.326z"
              stroke-width="1.5" 
              fill="#494949"
              style={{ x: 45, translateX: transformLeft, scaleX: .4 , scaleY: .3 }}
              animate={{
                translateY: y+18,
              }}
              transition={transition}
              initial={false}
            />
            <motion.text 
              className='dragger-label'
              x={transformLeft}
              style={{ x: 22 }}
              animate={{
                y: y+6,
              }}
              transition={transition}
              initial={false}
              fill='#f1f1f1'
              fontSize='14px'
            >{d3.format('d')(label)}</motion.text>
          </>
        ) : null;
      break;
    default: break;
  }


  return (dragger);
}

export default Dragger;