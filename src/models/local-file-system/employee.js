import { readJSON } from '../../utils/read-json.js'
import { randomUUID } from 'node:crypto'

const employees = readJSON('./json/employees.json')

export class EmployeeModel {
  static async getAll () {
    return employees
  }

  static async getById ({ id }) {
    return employees.filter(employee => employee.id === id)[0]
  }

  static async create ({ input }) {
    const newEmployee = {
      id: randomUUID(),
      ...input
    }

    employees.push(newEmployee)
    return newEmployee
  }

  static async update ({ id, input }) {
    const employeeIndex = employees.findIndex(employee => employee.id === id)
    if (employeeIndex === -1) return false
    const updatedEmployee = {
      ...employees[employeeIndex],
      ...input
    }
    employees[employeeIndex] = updatedEmployee
    return updatedEmployee
  }

  static async delete ({ id }) {
    const employeeIndex = employees.findIndex(employee => employee.id === id)
    if (employeeIndex === -1) return false
    employees.splice(employeeIndex, 1)
    return true
  }
}
