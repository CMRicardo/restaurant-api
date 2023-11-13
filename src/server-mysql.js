import { createApp } from './index.js'
import { CustomerModel } from './models/mysql/customer.js'
import { EmployeeModel } from './models/mysql/employee.js'
import { MenuItemModel } from './models/mysql/menu-item.js'

createApp({ customerModel: CustomerModel, employeeModel: EmployeeModel, menuItemModel: MenuItemModel })
