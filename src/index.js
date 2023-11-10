import express from 'express'
import crypto from 'node:crypto'
import cors from 'cors'

import { validateCustomer, validatePartialCustomer } from './schemas/customer.js'
import customers from './customer.json' assert { type: 'json' }

const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'http://litoral-restaurant.vercel.app',
    ]
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true) 
    }

    if (!origin) return callback(null, true)

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.send({ message: 'Hola mundo' })
})

app.get('/customers', (req, res) => {
  const { address } = req.query
  if (address) {
    const filteredCustomers = customers.filter(customer => customer.address === address)
    return res.json(filteredCustomers)
  }
  res.json(customers)
})

app.get('/customers/:id', (req, res) => {
  const { id } = req.params
  const customer = customers.find(customer => customer.id === id)
  if (customer) return res.send(customer)

  res.status(404).send({message: '404 - Customer Not Found'})
})

app.delete('/customers/:id', (req, res) => {
  const { id } = req.params
  const customerIndex = customers.findIndex(customer => customer.id === id)
  if (customerIndex === -1) return res.status(404).json({message: 'Customer Not Found'})

  customers.splice(customerIndex, 1)
  return res.json({message: 'Customer deleted!'})
})

app.post('/customers', (req, res) => {  
  const result = validateCustomer(req.body)

  if (result.error) {
    return res.status(400).json({error: JSON.parse(result.error.message)})
  }

  const newCustomer = {
    id: crypto.randomUUID(),
    ...result.data
  }

  customers.push(newCustomer)
  res.status(201).json(newCustomer)
})

app.patch('/customers/:id', (req, res) => {
  const result = validatePartialCustomer(req.body)

  if( result.error ) return res.status(400).json(result.error.message)

  const { id } = req.params
  const customerIndex = customers.findIndex(customer => customer.id === id)
  if (customerIndex === -1) return res.status(404).json({message: 'Customer Not Found!'})

  const updatedCustomer = {
    ...customers[customerIndex],
    ...result.data
  }
  customers[customerIndex] = updatedCustomer

  res.json(updatedCustomer)
})

app.use((req, res) => {
  res.status(404).send('404 - Not Found')
})

const PORT = process.env.PORT || 1234
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
