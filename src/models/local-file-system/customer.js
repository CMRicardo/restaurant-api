import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils/read-json.js'

const customers = readJSON('../customers.json')

export class CustomerModel {
  static async getAll ({ address }) {
    if (address) {
      return customers.filter(customer => customer.address === address)
    }
    return customers
  }

  static async getById ({ id }) {
    const customer = customers.find(customer => customer.id === id)
    return customer
  }

  static async create ({ input }) {
    const newCustomer = {
      id: randomUUID(),
      ...input
    }
    customers.push(newCustomer)
    return newCustomer
  }

  static async delete ({ id }) {
    const customerIndex = customers.findIndex(customer => customer.id === id)
    if (customerIndex === -1) return false

    customers.splice(customerIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const customerIndex = customers.findIndex(customer => customer.id === id)
    if (customerIndex === -1) return false

    const updatedCustomer = {
      ...customers[customerIndex],
      ...input
    }
    customers[customerIndex] = updatedCustomer
    return updatedCustomer
  }
}
