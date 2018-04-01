import { string } from 'prop-types'
import Link from 'next/link'

import escapePropertyName from '../../utils/escapePropertyName'

const PropertyLink = ({ name, ...props }) => {
  name = escapePropertyName(name)

  return <Link {...props} href={`/property?name=${name}`} as={`/${name}`} />
}

PropertyLink.displayName = 'PropertyLink'

PropertyLink.propTypes = {
  name: string.isRequired,
}

export default PropertyLink
