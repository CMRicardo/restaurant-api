import { Router } from 'express'

import { CustomerController } from '../controllers/customers.js'

export const createCustomerRouter = ({ customerModel }) => {
  const customerController = new CustomerController({ customerModel })

  const customerRouter = Router()

  customerRouter.get('/', customerController.getAll)
  customerRouter.get('/:id', customerController.getById)
  customerRouter.delete('/:id', customerController.delete)
  customerRouter.post('/', customerController.create)
  customerRouter.patch('/:id', customerController.update)

  return customerRouter
}
