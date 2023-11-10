import { Router } from 'express'

import { CustomerController } from '../controllers/customers.js'

export const customerRouter = Router()

customerRouter.get('/', CustomerController.getAll)

customerRouter.get('/:id', CustomerController.getById)

customerRouter.delete('/:id', CustomerController.delete)

customerRouter.post('/', CustomerController.create)

customerRouter.patch('/:id', CustomerController.update)
