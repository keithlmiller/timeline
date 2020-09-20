import { useRef, useLayoutEffect, useEffect } from 'react'


// taken and modified from https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj

const isBrowser = typeof window !== `undefined`

function getScrollPosition({ element, useWindow }) {
  if (!isBrowser || !element) return { x: 0, y: 0 }

  const target = element ? element.current : document.body
  const position = target.getBoundingClientRect()




  return useWindow
    ? { x: window.scrollX, y: window.scrollY }
    : { x: position.left, y: element.current.scrollTop }
}

export function useScrollPosition(effect, deps, element, useWindow, wait) {
  const position = useRef(getScrollPosition({ useWindow }))

  let throttleTimeout = null

  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow })

    effect({ prevPos: position.current, currPos })
    position.current = currPos
    throttleTimeout = null
  }

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait)
        }
      } else {
        callBack()
      }
    }

    const listener = !!element ? element.current : window;

    listener.addEventListener('scroll', handleScroll)

    return () => listener.removeEventListener('scroll', handleScroll)
  }, deps)
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}