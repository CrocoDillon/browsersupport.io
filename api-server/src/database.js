import mongoose from 'mongoose'

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
