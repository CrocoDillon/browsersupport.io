// Escapes like encodeURIComponent except @, [ and ]
const escapePropertyName = name =>
  encodeURIComponent(name).replace(/%(40|5B|5D)/g, (match, charCode) =>
    String.fromCharCode(parseInt(charCode, 16))
  )

export default escapePropertyName
