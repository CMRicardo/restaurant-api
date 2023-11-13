import { createApp } from './index.js'
import { CustomerModel } from './models/mysql/customer.js'
import { EmployeeModel } from './models/mysql/employee.js'

createApp({ customerModel: CustomerModel, employeeModel: EmployeeModel })
