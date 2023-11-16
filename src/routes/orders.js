import { Router } from 'express'
import { OrdersController } from '../controllers/orders.js'

export const createOrdersRouter = ({ orderModel }) => {
  const ordersRouter = new Router()
  const ordersController = new OrdersController({ orderModel })

  ordersRouter.get('/', ordersController.getAll)
  ordersRouter.get('/:id', ordersController.getById)
  ordersRouter.post('/', ordersController.create)
  ordersRouter.patch('/:id', ordersController.update)
  ordersRouter.delete('/:id', ordersController.delete)

  return ordersRouter
}
