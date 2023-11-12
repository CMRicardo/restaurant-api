export class EmployeeController {
  constructor ({ employeeModel }) {
    this.employeeModel = employeeModel
  }

  getAll = async (req, res) => {
    const employees = await this.employeeModel.getAll()
    res.json(employees)
  }
}
