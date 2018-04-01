import { object, shape, string } from 'prop-types'

export const propertyType = shape({
  _id: string.isRequired,
  name: string.isRequired,
  browsers: object,
})
