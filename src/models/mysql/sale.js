import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'restaurant',
  decimalNumbers: true
}
// const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const connectionString = DEFAULT_CONFIG
const connection = await mysql.createConnection(connectionString)

export class SalesModel {
  static async getAll ({ seller }) {
    const [bills] = await connection.query(`
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
        on emp.id = billC.idEmployee;  
    `)

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

  }

  static async create ({ input }) {

  }

  static async delete ({ id }) {

  }
}
