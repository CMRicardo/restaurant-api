import { validateSales } from '../schemas/sale.js'

export class SalesController {
  constructor ({ salesModel }) {
    this.salesModel = salesModel
  }

  getAll = async (req, res) => {
    const { seller } = req.query
    const sales = await this.salesModel.getAll({ seller })
    return res.json(sales)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const sale = await this.salesModel.getById({ id })

    if (!sale) return res.status(404).json({ message: 'Sale Not Found!' })
    return res.json(sale)
  }

  create = async (req, res) => {
    const result = validateSales(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newSale = await this.salesModel.create({ input: result.data })
    return res.status(201).json(newSale)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const wasDeleted = await this.salesModel.delete({ id })
    if (wasDeleted) return res.json({ message: 'Sale deleted!' })
    return res.status(404).json({ message: 'Sale Not Found!' })
  }
}
