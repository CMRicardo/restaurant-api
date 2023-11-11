import { createApp } from './index.js'
import { CustomerModel } from './models/mysql/customer.js'

createApp({ customerModel: CustomerModel })
