const app = require('./src/app')
// const { connectToDatabase } = require('./src/utils/db')

const PORT = process.env.PORT || 3055

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// const server = app.listen(PORT, () => {
//   console.log(`Backend start with ${PORT}`)
// })

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server'))
})
