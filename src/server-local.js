import { createApp } from './index.js'
import { CustomerModel } from './models/local-file-system/customer.js'
import { EmployeeModel } from './models/local-file-system/employee.js'

createApp({ customerModel: CustomerModel, employeeModel: EmployeeModel })
