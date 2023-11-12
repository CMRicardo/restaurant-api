import { validateEmployee, validateParcialEmployee } from '../schemas/employee.js'

export class EmployeeController {
  constructor ({ employeeModel }) {
    this.employeeModel = employeeModel
  }

  getAll = async (req, res) => {
    const employees = await this.employeeModel.getAll()
    res.json(employees)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const employee = await this.employeeModel.getById({ id })

    if (!employee) return res.status(404).json({ message: 'Employee Not Found!' })
    return res.json(employee)
  }

  create = async (req, res) => {
    const result = validateEmployee(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const newEmployee = await this.employeeModel.create({ input: result.data })

    res.status(201).json(newEmployee)
  }

  update = async (req, res) => {
    const result = validateParcialEmployee(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params
    const updatedEmployee = await this.employeeModel.update({ input: result.data, id })

    if (!updatedEmployee) return res.status(404).json({ message: 'Employee Not Found!' })

    return res.json(updatedEmployee)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.employeeModel.delete({ id })
    if (!result) return res.status(404).json({ message: 'Employee Not Found' })

    return res.json({ message: 'Employee deleted!' })
  }
}
