import { Router } from 'express'

export const createEmployeeRouter = () => {
  const employeeRouter = new Router()

  employeeRouter.get('/', (req, res) => {
    res.json({ message: 'Employees works!' })
  })

  return employeeRouter
}
