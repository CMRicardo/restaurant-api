// import { CustomerModel } from '../models/local-file-system/customer.js'
// import { CustomerModel } from '../models/mysql/customer.js'
import { validateCustomer, validatePartialCustomer } from '../schemas/customer.js'

export class CustomerController {
  constructor ({ customerModel }) {
    this.customerModel = customerModel
  }

  getAll = async (req, res) => {
    const { address } = req.query
    const customers = await this.customerModel.getAll({ address })

    res.json(customers)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const customer = await this.customerModel.getById({ id })
    if (customer) return res.send(customer)

    res.status(404).send({ message: '404 - Customer Not Found' })
  }

  create = async (req, res) => {
    const result = validateCustomer(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newCustomer = await this.customerModel.create({ input: result.data })
    res.status(201).json(newCustomer)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.customerModel.delete({ id })
    if (!result) {
      return res.status(404).json({ message: 'Customer Not Found!' })
    }
    return res.json({ message: 'Customer deleted!' })
  }

  update = async (req, res) => {
    const result = validatePartialCustomer(req.body)

    if (result.error) return res.status(400).json(result.error.message)

    const { id } = req.params

    const updatedCustomer = await this.customerModel.update({ id, input: result.data })

    res.json(updatedCustomer)
  }
}
