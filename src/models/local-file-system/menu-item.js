import { readJSON } from '../../utils/read-json.js'

const menuItems = readJSON('./json/menu-items.json')
export class MenuItemModel {
  static async getAll ({ category }) {
    if (category) {
      return menuItems.filter(menuItem => menuItem.category === category)
    }
    return menuItems
  }

  static async getById ({ id }) {
    const menuItemIndex = menuItems.findIndex(menuItem => menuItem.id === id)
    if (menuItemIndex === -1) return false
    return menuItems[menuItemIndex]
  }

  static async create ({ input }) {
    const newMenuItem = {
      id: crypto.randomUUID(),
      ...input
    }
    menuItems.push(newMenuItem)
    return newMenuItem
  }

  static async update ({ id, input }) {
    const originalMenuItemIndex = menuItems.findIndex(menuItem => menuItem.id === id)
    if (originalMenuItemIndex === -1) return false

    const updatedMenuItem = {
      ...menuItems[originalMenuItemIndex],
      ...input
    }
    menuItems[originalMenuItemIndex] = updatedMenuItem

    return updatedMenuItem
  }

  static async delete ({ id }) {
    const originalMenuItemIndex = menuItems.findIndex(menuItem => menuItem.id === id)
    if (originalMenuItemIndex === -1) return false
    menuItems.splice(originalMenuItemIndex, 1)
    return true
  }
}
