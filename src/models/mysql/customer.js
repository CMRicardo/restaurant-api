import { createUUID } from '../../utils/createUUID.js'
import { connection } from '../../utils/db-connection.js'

export class CustomerModel {
  static async getAll ({ address }) {
    if (address) {
      const lowerCaseAddress = address.toLowerCase()
      const [customers] = await connection.query(`
        SELECT
          BIN_TO_UUID(id) AS id,
          firstName,
          secondName,
          lastName,
          email,
          address,
          password,
          phoneNumber from customer
        WHERE LOWER(address) = ?;`, [lowerCaseAddress])
      return customers
    }

    const [customers] = await connection.query(`
      SELECT
        BIN_TO_UUID(id) AS id,
        firstName,
        secondName,
        lastName,
        email,
        address,
        password,
        phoneNumber FROM customer;`)
    return customers
  }

  static async getById ({ id }) {
    const [customers] = await connection.query(`
      SELECT
        BIN_TO_UUID(id) AS id,
        firstName,
        secondName,
        lastName,
        email,
        address,
        password,
        phoneNumber from customer
      WHERE id = UUID_TO_BIN(?);`, [id])
    return customers.length !== 0 ? customers[0] : null
  }

  static async create ({ input }) {
    const {
      firstName,
      secondName,
      lastName,
      email,
      password,
      phoneNumber,
      address
    } = input

    const uuid = await createUUID()

    try {
      await connection.query(`
        INSERT INTO customer
          (id, firstName, secondName, lastName, email, password, phoneNumber, address) VALUES 
          (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?);
      `, [uuid, firstName, secondName, lastName, email, password, phoneNumber, address])
    } catch (error) {
      return false
    }

    const newCustomer = await this.getById({ id: uuid })
    return newCustomer
  }

  static async delete ({ id }) {
    try {
      await connection.query(`
        DELETE FROM customer WHERE id = UUID_TO_BIN(?);
      `, [id])
      return true
    } catch (error) {
      return false
    }
  }

  static async update ({ id, input }) {
    const originalCustomer = await this.getById({ id })

    const updatedCustomer = {
      ...originalCustomer,
      ...input
    }
    const {
      firstName,
      secondName,
      lastName,
      email,
      password,
      phoneNumber,
      address
    } = updatedCustomer

    try {
      await connection.query(`
        UPDATE customer SET
          firstName = ?,
          secondName = ?,
          lastName = ?,
          email = ?,
          password = ?,
          phoneNumber = ?,
          address = ?
        WHERE id = UUID_TO_BIN(?);
      `, [firstName, secondName, lastName, email, password, phoneNumber, address, id])

      return updatedCustomer
    } catch (error) {
      return false
    }
  }
}
