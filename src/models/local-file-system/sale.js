import { readJSON } from '../../utils/read-json.js'

const sales = readJSON('./json/sales.json')

export class SalesModel {
  static async getAll ({ seller }) {
    if (seller) {
      const filteredSellers = sales.filter(sale => sale.seller === seller)
      return filteredSellers.length > 0 ? filteredSellers : []
    }
    return sales
  }

  static async getById ({ id }) {
    const saleIndex = sales.findIndex(sale => sale.id === id)
    if (saleIndex === -1) return false
    return sales[saleIndex]
  }

  static async create ({ input }) {
    const newSale = {
      id: crypto.randomUUID(),
      ...input
    }
    sales.push(newSale)
    return newSale
  }

  static async delete ({ id }) {
    const saleIndex = sales.findIndex(sale => sale.id === id)
    if (saleIndex === -1) return false
    sales.splice(saleIndex, 1)
    return true
  }
}
