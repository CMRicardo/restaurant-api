import { validateOrder, validatePartialOrder } from '../schemas/order.js'

export class OrdersController {
  constructor ({ orderModel }) {
    this.orderModel = orderModel
  }

  getAll = async (req, res) => {
    const { idCustomer } = req.query
    const orders = await this.orderModel.getAll({ idCustomer })
    return res.json(orders)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const order = await this.orderModel.getById({ id })
    if (!order) return res.status(404).json({ message: 'Order not found!' })

    return res.json(order)
  }

  create = async (req, res) => {
    const result = validateOrder(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newOrder = await this.orderModel.create({ input: result.data })
    if (!newOrder) return res.status(500).json({ message: 'Error creating order!' })
    return res.status(200).json(newOrder)
  }

  update = async (req, res) => {
    const result = validatePartialOrder(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params
    const updatedMenuItem = await this.orderModel.update({ input: result.data, id })
    res.json(updatedMenuItem)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.orderModel.delete({ id })
    if (!result) return res.status(404).json({ message: 'Menu item not found!' })
    return res.json({ message: 'Menu item deleted!' })
  }
}
