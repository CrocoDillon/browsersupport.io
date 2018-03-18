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
})

PropertySchema.index(
  { name: 1 },
  { name: 'name_c', collation: { locale: 'en', strength: 1 } }
)

const Property = mongoose.model('Property', PropertySchema, 'properties')

module.exports = {
  addProperties: async properties => {
    await Property.insertMany(properties.map(name => ({ name })), {
      ordered: false,
    }).catch(error => {
      // ignore duplicate errors
    })
  },
}
