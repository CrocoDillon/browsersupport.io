/* eslint react/display-name: 0 */
import { oneOf } from 'prop-types'

const icons = {
  bug: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path stroke="currentColor" strokeLinecap="round" d="M9.5 6.5l3-2" />
      <path stroke="currentColor" strokeLinecap="round" d="M10.5 9.5l3 4" />
      <path stroke="currentColor" strokeLinecap="round" d="M10.5 7.5l4 2" />
      <path stroke="currentColor" strokeLinecap="round" d="M5.5 6.5l-3-2" />
      <path stroke="currentColor" strokeLinecap="round" d="M4.5 9.5l-3 4" />
      <path stroke="currentColor" strokeLinecap="round" d="M4.5 7.5l-4 2" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        d="M6.5 4s-.5-3.5-2.5-3.5"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        d="M8 4s.5-3.5 2.5-3.5"
      />
      <path
        fill="currentColor"
        d="M7.517 2c1.985 0 3.252 2.586 1.957 3.972l-3.941.028c-1.323-1.352 0-4 1.984-4z"
      />
      <path
        fill="currentColor"
        d="M7.5 5c-2.485 0-4.5 2.462-4.5 5.5 0 2.349 1.208 4.349 2.904 5.137.585-.437 1.096-1.226 1.096-2.137v-6c0-.276.224-.5.5-.5s.5.224.5.5v6c0 .911.511 1.7 1.096 2.137 1.696-.788 2.904-2.788 2.904-5.137 0-3.038-2.015-5.5-4.5-5.5z"
      />
    </svg>
  ),
  'open-source': () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        d="M8 0c-4.418 0-8 3.582-8 8 0 3.429 2.162 6.346 5.194 7.484l1.756-4.683c-1.137-.427-1.95-1.515-1.95-2.801 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.286-.813 2.374-1.95 2.801l1.756 4.683c3.032-1.138 5.194-4.055 5.194-7.484 0-4.418-3.582-8-8-8z"
      />
    </svg>
  ),
  twitter: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        d="M5.032 13c-1.854 0-3.579-.543-5.032-1.474.257.03.518.046.783.046 1.538 0 2.953-.525 4.077-1.405-1.437-.027-2.649-.975-3.067-2.279.2.038.406.059.618.059.299 0 .589-.04.865-.115-1.502-.301-2.633-1.628-2.633-3.218 0-.014 0-.028 0-.041.443.246.949.393 1.487.41-.881-.589-1.46-1.593-1.46-2.732 0-.601.162-1.165.444-1.65 1.619 1.986 4.038 3.292 6.766 3.429-.056-.24-.085-.491-.085-.748 0-1.812 1.47-3.282 3.283-3.282.944 0 1.797.399 2.396 1.036.748-.147 1.45-.42 2.084-.796-.245.766-.766 1.409-1.443 1.816.664-.079 1.297-.256 1.885-.517-.44.658-.997 1.236-1.638 1.699.006.141.009.282.009.425 0 4.337-3.302 9.338-9.34 9.338"
        transform="translate(0 1)"
      />
    </svg>
  ),
}

const Icon = props => {
  const { glyph } = props
  const Svg = icons[glyph]

  return <Svg />
}

Icon.displayName = 'Icon'

Icon.propTypes = {
  glyph: oneOf(Object.keys(icons)).isRequired,
}

export default Icon
