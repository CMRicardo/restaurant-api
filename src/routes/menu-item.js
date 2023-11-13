import { Router } from 'express'
import { MenuItemController } from '../controllers/menu-item.js'

export const createMenuItemRouter = ({ menuItemModel }) => {
  const menuItemRouter = new Router()
  const menuItemController = new MenuItemController({ menuItemModel })

  menuItemRouter.get('/', menuItemController.getAll)
  menuItemRouter.get('/:id', menuItemController.getById)
  menuItemRouter.post('/', menuItemController.create)
  menuItemRouter.patch('/:id', menuItemController.update)
  menuItemRouter.delete('/:id', menuItemController.delete)

  return menuItemRouter
}
