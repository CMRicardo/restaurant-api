import { readJSON } from '../../utils/read-json.js'

const employees = readJSON('./json/employees.json')

export class EmployeeModel {
  static async getAll () {
    return employees
  }

  static async getById ({ id }) {
    return employees.filter(employee => employee.id === id)
  }
}
