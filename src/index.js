import express from 'express'
import crypto from 'node:crypto'

import customers from './customer.json' assert { type: 'json' }

const app = express()
app.use(express.json())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.send({message: 'Hola mundo'})
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

app.post('/customers', (req, res) => {
  const {
    first_name,
    second_name,
    last_name,
    email,
    password,
    address,
    phone_number
  } = req.body

  const newCustomer = {
    id: crypto.randomUUID(),
    first_name,
    second_name: second_name ?? '',
    last_name,
    email,
    password,
    address,
    phone_number
  }

  customers.push(newCustomer)
  res.status(201).json(newCustomer)
})

app.use((req, res) => {
  res.status(404).send('404 - Not Found')
})

const PORT = process.env.PORT || 1234
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
