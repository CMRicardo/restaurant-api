import { Router } from 'express'
import crypto from 'node:crypto'

import { readJSON } from '../utils/read-json.js'
import { validateCustomer, validatePartialCustomer } from '../schemas/customer.js'

const customers = readJSON('../customers.json')
export const moviesRouter = Router()

moviesRouter.get('/', (req, res) => {
  const { address } = req.query
  if (address) {
    const filteredCustomers = customers.filter(customer => customer.address === address)
    return res.json(filteredCustomers)
  }
  res.json(customers)
})

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const customer = customers.find(customer => customer.id === id)
  if (customer) return res.send(customer)

  res.status(404).send({ message: '404 - Customer Not Found' })
})

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const customerIndex = customers.findIndex(customer => customer.id === id)
  if (customerIndex === -1) return res.status(404).json({ message: 'Customer Not Found' })

  customers.splice(customerIndex, 1)
  return res.json({ message: 'Customer deleted!' })
})

moviesRouter.post('/', (req, res) => {
  const result = validateCustomer(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newCustomer = {
    id: crypto.randomUUID(),
    ...result.data
  }

  customers.push(newCustomer)
  res.status(201).json(newCustomer)
})

moviesRouter.patch('/:id', (req, res) => {
  const result = validatePartialCustomer(req.body)

  if (result.error) return res.status(400).json(result.error.message)

  const { id } = req.params
  const customerIndex = customers.findIndex(customer => customer.id === id)
  if (customerIndex === -1) return res.status(404).json({ message: 'Customer Not Found!' })

  const updatedCustomer = {
    ...customers[customerIndex],
    ...result.data
  }
  customers[customerIndex] = updatedCustomer

  res.json(updatedCustomer)
})
