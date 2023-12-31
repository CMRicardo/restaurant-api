import express from 'express'
import 'dotenv/config.js'

import { createCustomerRouter } from './routes/customers.js'
import { createEmployeeRouter } from './routes/employees.js'
import { corsMiddleware } from './middlewares/cors.js'
import { createMenuItemRouter } from './routes/menu-item.js'
import { createSalesRouter } from './routes/sales.js'
import { createOrdersRouter } from './routes/orders.js'

export const createApp = ({ customerModel, employeeModel, menuItemModel, salesModel, orderModel }) => {
  const app = express()
  app.use(express.json())
  app.use(corsMiddleware())

  app.disable('x-powered-by')

  app.get('/', (req, res) => {
    res.send({ message: 'Hola mundo' })
  })

  app.use('/customers', createCustomerRouter({ customerModel }))
  app.use('/employees', createEmployeeRouter({ employeeModel }))
  app.use('/menu-items', createMenuItemRouter({ menuItemModel }))
  app.use('/sales', createSalesRouter({ salesModel }))
  app.use('/orders', createOrdersRouter({ orderModel }))

  app.use((req, res) => {
    res.status(404).send('404 - Not Found')
  })

  const PORT = process.env.PORT || 1234
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
  })
}
