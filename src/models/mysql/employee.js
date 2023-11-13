import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'restaurant'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
// const connectionString = DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class EmployeeModel {
  static async getAll ({ type }) {
    if (type) {
      const lowerCaseType = type.toLowerCase()
      const [employees] = await connection.query(`
      select BIN_TO_UUID(em.id) as id,
        et.type,
        firstName,
        secondName,
        lastName,
        idNumber,
        phoneNumber,
        email,
        profilePictureUrl,
        address
      from employee as em
      join employeeType as et where et.id = em.employeeType and LOWER(et.type) = ?;
      `, [lowerCaseType])

      return employees
    }

    const [employees] = await connection.query(`
      select BIN_TO_UUID(em.id) as id,
        et.type as employeeType,
        firstName,
        secondName,
        lastName,
        idNumber,
        phoneNumber,
        email,
        profilePictureUrl,
        address
      from employee as em
      join employeeType as et where et.id = em.employeeType;
    `)

    return employees
  }

  static async getById ({ id }) {
    const [employees] = await connection.query(`
      select BIN_TO_UUID(em.id) as id,
        et.type as employeeType,
        firstName,
        secondName,
        lastName,
        idNumber,
        phoneNumber,
        email,
        profilePictureUrl,
        address
      from employee as em
      join employeeType as et where et.id = em.employeeType and BIN_TO_UUID(em.id) = ?;
    `, [id])
    return employees.length !== 0 ? employees[0] : null
  }

  static async create ({ input }) {
    const {
      employeeType,
      firstName,
      secondName,
      lastName,
      idNumber,
      phoneNumber,
      email,
      profilePictureUrl,
      address
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(`
        insert into employee
          (id, employeeType, firstName, secondName, lastName, idNumber, phoneNumber, email, address, profilePictureUrl)
        values (
          (select UUID_TO_BIN(?)),
          (select id from employeeType where type = ?),
          ?, ?, ?, ?, ?, ?, ?, ?
      );
      `, [uuid, employeeType, firstName, secondName, lastName, idNumber, phoneNumber, email, address, profilePictureUrl])
    } catch (error) {
      return false
    }

    const newEmployee = await this.getById({ id: uuid })
    return newEmployee
  }

  static async update ({ id, input }) {
    const originalEmployee = await this.getById({ id })
    const updatedEmployee = {
      ...originalEmployee,
      ...input
    }
    const {
      employeeType,
      firstName,
      secondName,
      lastName,
      idNumber,
      phoneNumber,
      email,
      profilePictureUrl,
      address
    } = updatedEmployee

    try {
      await connection.query(`
        UPDATE employee SET
          employeeType = (select id from employeeType where type = ?),
          firstName = ?,
          secondName = ?,
          lastName = ?,
          idNumber = ?,
          phoneNumber = ?,
          email = ?,
          profilePictureUrl = ?,
          address = ?
        WHERE id = UUID_TO_BIN(?);
      `, [employeeType, firstName, secondName, lastName, idNumber, phoneNumber, email, profilePictureUrl, address, id])
      return updatedEmployee
    } catch (error) {
      return false
    }
  }

  static async delete ({ id }) {
    try {
      await connection.query(`
        delete from employee where id = UUID_TO_BIN(?);
      `, [id])
      return true
    } catch (error) {
      return false
    }
  }
}
