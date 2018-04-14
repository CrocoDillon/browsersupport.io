const mongoose = require('mongoose')

/**
 * Connection initialization
 */
const connect = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    keepAlive: 1,
  })
}

mongoose.connection.on('error', err => {
  console.error('Mongoose error: ', err)
})

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected... reconnecting!')
  connect()
})

connect()

/**
 * Property schema
 */
const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  browsers: {
    type: mongoose.Schema.Types.Mixed,
  },
})

PropertySchema.index(
  { name: 1 },
  { name: 'name_c', collation: { locale: 'en', strength: 1 } }
)

const Property = mongoose.model('Property', PropertySchema, 'properties')

module.exports = {
  addProperties: properties =>
    Property.insertMany(properties.map(name => ({ name })), {
      ordered: false,
    }).catch(() => {
      // ignore duplicate errors
    }),
  countProperties: (browser, version) => {
    if (browser && version) {
      return Property.count({
        [`browsers.${browser}.${version}`]: { $eq: null },
      })
    }

    return Property.count()
  },
  getProperties: (browser, version) => {
    return Property.find(
      {
        [`browsers.${browser}.${version}`]: { $eq: null },
      },
      { name: 1 }
    ).limit(500)
  },
  updateProperties: (browser, version, properties) => {
    return properties.map(property => {
      const { name, ...rest } = property

      if (typeof name !== 'string') {
        throw new Error('Invalid or missing property name')
      }

      Object.keys(rest).forEach(key => {
        // Whitelist of keys as sanity check
        if (
          !(
            ['parent', 'parentProto', 'symbol', 'in', 'own'].includes(key) &&
            typeof rest[key] === 'boolean'
          )
        ) {
          throw new Error(
            `Invalid key "${key}" or value type "${typeof rest[key]}"`
          )
        }
      })

      return Property.update(
        { name },
        { $set: { [`browsers.${browser}.${version}`]: rest } }
      ).exec()
    })
  },
}
