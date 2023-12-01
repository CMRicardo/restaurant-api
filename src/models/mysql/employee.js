import { connection } from '../../utils/db-connection.js'

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
        password,
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
        password,
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
        password,
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
      password,
      profilePictureUrl,
      address
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(`
        insert into employee
          (id, employeeType, firstName, secondName, lastName, idNumber, phoneNumber, email, address, profilePictureUrl, password)
        values (
          (select UUID_TO_BIN(?)),
          (select id from employeeType where type = ?),
          ?, ?, ?, ?, ?, ?, ?, ?, ?
      );
      `, [uuid, employeeType, firstName, secondName, lastName, idNumber, phoneNumber, email, address, profilePictureUrl, password])
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
      password,
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
          address = ?,
          password = ?
        WHERE id = UUID_TO_BIN(?);
      `, [employeeType, firstName, secondName, lastName, idNumber, phoneNumber, email, profilePictureUrl, address, password, id])
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
