import { createUUID } from '../../utils/createUUID.js'
import { connection } from '../../utils/db-connection.js'

export class SalesModel {
  static async #getBills ({ sellerId, initialDate, endDate } = {}) {
    const query = `
      select
        bin_to_uuid(billC.id) as id,
        cs.name as 'status',
        bin_to_uuid(billC.idEmployee) as sellerId,
        concat(emp.firstName, ' ', emp.lastName) as seller,
        billC.emissionDate as date,
        billC.subtotal,
        billC.taxes,
        billC.total
      from billCustomer as billC
      join employee as emp
        on emp.id = billC.idEmployee
      join currentStatus as cs
        on billC.currentStatus = cs.id
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
    return bills.length > 0 ? bills : []
  }

  static async #getItems ({ id }) {
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
    `, [id])
    return items
  }

  static async getAll ({ sellerId, initialDate, endDate } = {}) {
    const bills = await this.#getBills({ sellerId, initialDate, endDate })

    const sales = await Promise.all(bills.map(async bill => {
      const items = await this.#getItems({ id: bill.id })
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
        cs.name as 'status',
        bin_to_uuid(billC.idEmployee) as sellerId,
        concat(emp.firstName, ' ', emp.lastName) as seller,
        billC.emissionDate as date,
        billC.subtotal,
        billC.taxes,
        billC.total
      from billCustomer as billC
      join employee as emp
        on emp.id = billC.idEmployee
      join currentStatus as cs
        on billC.currentStatus = cs.id
      where bin_to_uuid(billC.id) = ?;
    `, [id])
    const sale = sales[0]
    const items = await this.#getItems({ id: sale.id })

    return {
      ...sale,
      items
    }
  }

  static async create ({ input }) {
    const uuid = await createUUID()
    const newSale = {
      id: uuid,
      ...input
    }
    const {
      sellerId,
      date,
      subtotal,
      total,
      taxes,
      items
    } = newSale

    await connection.query(`
      insert into billCustomer (id, idEmployee, subtotal, taxes, total, emissionDate)
      values (
        (uuid_to_bin(?)),
        (uuid_to_bin(?)),
        ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s.%f')
      );
    `, [uuid, sellerId, subtotal, taxes, total, date])

    await Promise.all(items.map(async (item) => {
      return await connection.query(`
        insert into billCustomerDetails (idBill, idMenuItem, quantity, subtotal)
        values (
          uuid_to_bin(?),
          (uuid_to_bin((select bin_to_uuid(id) from menuItem where name = ?))),
          ?,
          ?
        );
        `, [uuid, item.name, item.quantity, Number(item.quantity) * Number(item.price)])
    }))

    return newSale
  }

  static async delete ({ id }) {
    try {
      await connection.query(`
        delete from billCustomerDetails where bin_to_uuid(idBill) = ?;
      `, [id])
      await connection.query(`
        delete from billCustomer where bin_to_uuid(id) = ?;
      `, [id])

      return true
    } catch (error) {
      return false
    }
  }
}
