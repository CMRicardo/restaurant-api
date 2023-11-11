import { createApp } from './index.js'
import { CustomerModel } from './models/local-file-system/customer.js'

createApp({ customerModel: CustomerModel })
