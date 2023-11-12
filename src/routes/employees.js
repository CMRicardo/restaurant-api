import { Router } from 'express'
import { EmployeeController } from '../controllers/employees.js'

export const createEmployeeRouter = ({ employeeModel }) => {
  const employeeRouter = new Router()
  const employeeController = new EmployeeController({ employeeModel })

  employeeRouter.get('/', employeeController.getAll)
  employeeRouter.get('/:id', (req, res) => {
    res.json({ message: 'Employees works!' })
  })
  employeeRouter.post('/:id', (req, res) => {
    res.json({ message: 'Creado!' })
  })

  return employeeRouter
}
