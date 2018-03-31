import { oneOf } from 'prop-types'
import cn from 'classnames'

import styles from './Tooltip.css'

const Tooltip = props => {
  const {
    placement,
    background,
    arrowOffsetTop,
    arrowOffsetLeft,
    style,
    children,
  } = props

  const className = cn(styles.Tooltip, styles[placement], styles[background])
  const arrowStyle = {
    top: arrowOffsetTop,
    left: arrowOffsetLeft,
  }

  return (
    <div className={className} style={style}>
      <div className={styles.arrow} style={arrowStyle} />
      {children}
    </div>
  )
}

Tooltip.displayName = 'Tooltip'

Tooltip.propTypes = {
  placement: oneOf(['top', 'left', 'right', 'bottom']),
  background: oneOf(['green', 'red', 'yellow']),
}

Tooltip.defaultProps = {
  placement: 'top',
}

export default Tooltip
