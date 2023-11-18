import { connection } from '../../utils/db-connection.js'

export class SalesModel {
  static async #getBills ({ sellerId, initialDate, endDate } = {}) {
    const query = `
      select
        bin_to_uuid(billC.id) as id,
        bin_to_uuid(billC.idEmployee) as sellerId,
        concat(emp.firstName, ' ', emp.lastName) as seller,
        billC.emissionDate as date,
        billC.subtotal,
        billC.taxes,
        billC.total
      from billCustomer as billC
      join employee as emp
        on emp.id = billC.idEmployee
      where
      ${sellerId
          ? 'billC.idEmployee = uuid_to_bin(?)'
          : 'true'
        }
      ${initialDate && endDate
          ? 'and billC.emissionDate between ? and ?'
          : 'and true'
      }
      ;
    `

    const paramsArray = [sellerId, initialDate, endDate]
    if (!sellerId) paramsArray.splice(0, 1)

    const [bills] = await connection.query(query, paramsArray)
    return bills
  }

  static async getAll ({ sellerId, initialDate, endDate } = {}) {
    const bills = await this.#getBills({ sellerId, initialDate, endDate })

    const sales = await Promise.all(bills.map(async bill => {
      const [items] = await connection.query(`
        select
          mi.name,
          mi.price,
          billD.quantity
        from billCustomerDetails as billD
        join menuItem as mi
          on mi.id = billD.idMenuItem
        join billCustomer as billC
          on billC.id = billD.idBill
        where bin_to_uuid(billC.id) = ?;
    `, [bill.id])

      return {
        ...bill,
        items
      }
    }))
    return sales
  }

  static async getById ({ id }) {
    const [sales] = await connection.query(`
      select
        bin_to_uuid(billC.id) as id,
        bin_to_uuid(billC.idEmployee) as sellerId,
        concat(emp.firstName, ' ', emp.lastName) as seller,
        billC.emissionDate as date,
        billC.subtotal,
        billC.taxes,
        billC.total
      from billCustomer as billC
      join employee as emp
        on emp.id = billC.idEmployee
      where bin_to_uuid(billC.id) = ?;
    `, [id])
    return sales[0]
  }

  static async create ({ input }) {

  }

  static async delete ({ id }) {

  }
}
