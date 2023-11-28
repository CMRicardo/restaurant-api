import { Router } from 'express'
import { SalesController } from '../controllers/sales.js'

export const createSalesRouter = ({ salesModel }) => {
  const salesRouter = new Router()
  const salesController = new SalesController({ salesModel })

  salesRouter.get('/', salesController.getAll)
  salesRouter.get('/:id', salesController.getById)
  salesRouter.post('/', salesController.create)
  salesRouter.patch('/:id', salesController.update)
  salesRouter.delete('/:id', salesController.delete)

  return salesRouter
}
