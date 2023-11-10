import express from 'express'

import { moviesRouter } from './routes/customers.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.use(express.json())
app.use(corsMiddleware())

app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.send({ message: 'Hola mundo' })
})

app.use('/customers', moviesRouter)

app.use((req, res) => {
  res.status(404).send('404 - Not Found')
})

const PORT = process.env.PORT || 1234
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
