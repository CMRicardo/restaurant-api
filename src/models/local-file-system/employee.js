import { readJSON } from '../../utils/read-json'

const employees = readJSON('./json/employess.json')

export class EmployeeModel {
  getAll = async () => {
    return employees
  }
}
