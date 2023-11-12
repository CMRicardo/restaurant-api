import { Router } from 'express'
import { EmployeeController } from '../controllers/employees.js'

export const createEmployeeRouter = ({ employeeModel }) => {
  const employeeRouter = new Router()
  const employeeController = new EmployeeController({ employeeModel })

  employeeRouter.get('/', employeeController.getAll)
  employeeRouter.get('/:id', employeeController.getById)
  employeeRouter.post('/', employeeController.create)
  employeeRouter.patch('/:id', employeeController.update)
  employeeRouter.delete('/:id', employeeController.delete)

  return employeeRouter
}
