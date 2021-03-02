import React, { useRef, useState, useEffect } from 'react'
import { useViewportScroll, useTransform, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { getFullScrollPos } from '../utils/scroll'

export const ScrollOpacity = ({
  children,
  opacityPositions = [0, 0.4, 0.6, 1],
  ease
}) => {
  const { scrollY } = useViewportScroll()
  const ref = useRef()
  const [startPosition, setStartPosition] = useState(0)
  const [visibleStartPosition, setVisibleStartPosition] = useState(0)
  const [visibleEndPosition, setVisibleEndPosition] = useState(0)
  const [endPosition, setEndPosition] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const setValues = () => {
      const $ref = ref.current

      // Get animation positions
      const positions = getFullScrollPos({
        $ref,
        startPercentile: opacityPositions[0],
        startFullPercentile: opacityPositions[1],
        endFullPercentile: opacityPositions[2],
        endPercentile: opacityPositions[3]
      })
      setStartPosition(positions.startPos)
      setVisibleStartPosition(positions.startFullPos)
      setVisibleEndPosition(positions.endFullPos)
      setEndPosition(positions.endPos)
    }

    setValues()
    window.addEventListener('load', setValues)
    window.addEventListener('resize', setValues)

    return () => {
      window.removeEventListener('load', setValues)
      window.removeEventListener('resize', setValues)
    }
  }, [ref])

  const opacity = useTransform(
    scrollY,
    [startPosition, visibleStartPosition, visibleEndPosition, endPosition],
    [0, 1, 1, 0],
    ease
  )

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} style={{ opacity }}>
      {children}
    </motion.div>
  )
}

ScrollOpacity.propTypes = {
  children: PropTypes.node,
  opacityPositions: PropTypes.arrayOf(PropTypes.number),
  ease: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number)
  ])
}
