import { CustomerModel } from '../models/local-file-system/customer.js'
// import { CustomerModel } from '../models/mysql/customer.js'
import { validateCustomer, validatePartialCustomer } from '../schemas/customer.js'

export class CustomerController {
  static async getAll (req, res) {
    const { address } = req.query
    const customers = await CustomerModel.getAll({ address })

    res.json(customers)
  }

  static async getById (req, res) {
    const { id } = req.params
    const customer = await CustomerModel.getById({ id })
    if (customer) return res.send(customer)

    res.status(404).send({ message: '404 - Customer Not Found' })
  }

  static async create (req, res) {
    const result = validateCustomer(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newCustomer = await CustomerModel.create({ input: result.data })
    res.status(201).json(newCustomer)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await CustomerModel.delete({ id })
    if (!result) {
      return res.status(404).json({ message: 'Customer Not Found!' })
    }
    return res.json({ message: 'Customer deleted!' })
  }

  static async update (req, res) {
    const result = validatePartialCustomer(req.body)

    if (result.error) return res.status(400).json(result.error.message)

    const { id } = req.params

    const updatedCustomer = await CustomerModel.update({ id, input: result.data })

    res.json(updatedCustomer)
  }
}
