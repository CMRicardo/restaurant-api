import { readJSON } from '../../utils/read-json.js'

const orders = readJSON('./json/orders.json')
export class OrderModel {
  static async getAll ({ idCustomer }) {
    if (idCustomer) {
      const filteredOrders = orders.filter(order => order.idCustomer === idCustomer)
      return filteredOrders.length > 0 ? filteredOrders : []
    }
    return orders
  }

  static async getById ({ id }) {
    const orderIndex = orders.findIndex(order => order.id === id)
    if (orderIndex === -1) return false
    return orders[orderIndex]
  }

  static async create ({ input }) {
    const newOrder = {
      id: crypto.randomUUID(),
      ...input
    }
    orders.push(newOrder)
    return newOrder
  }

  static async update ({ id, input }) {
    const orderIndex = orders.findIndex(order => order.id === id)
    if (orderIndex === -1) return false
    const updatedOrder = {
      ...orders[orderIndex],
      ...input
    }
    orders[orderIndex] = updatedOrder
    return updatedOrder
  }

  static async delete ({ id }) {
    const orderIndex = orders.findIndex(order => order.id === id)
    if (orderIndex === -1) return false
    orders.splice(orderIndex, 1)
    return true
  }
}
