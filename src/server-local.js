import { createApp } from './index.js'
import { CustomerModel } from './models/local-file-system/customer.js'
import { EmployeeModel } from './models/local-file-system/employee.js'
import { MenuItemModel } from './models/local-file-system/menu-item.js'
import { SalesModel } from './models/local-file-system/sale.js'

createApp({
  customerModel: CustomerModel,
  employeeModel: EmployeeModel,
  menuItemModel: MenuItemModel,
  salesModel: SalesModel
})
