import { validateMenuItem, validatePartialMenuItem } from '../schemas/menu-item.js'

export class MenuItemController {
  constructor ({ menuItemModel }) {
    this.menuItemModel = menuItemModel
  }

  getAll = async (req, res) => {
    const { category } = req.query
    const menuItems = await this.menuItemModel.getAll({ category })
    return res.json(menuItems)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const menuItem = await this.menuItemModel.getById({ id })
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found!' })

    return res.json(menuItem)
  }

  create = async (req, res) => {
    const result = validateMenuItem(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newMenuItem = await this.menuItemModel.create({ input: result.data })
    if (!newMenuItem) return res.status(500).json({ message: 'Error creating menu item!' })
    return res.status(200).json(newMenuItem)
  }

  update = async (req, res) => {
    const result = validatePartialMenuItem(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params
    const updatedMenuItem = await this.menuItemModel.update({ input: result.data, id })
    res.json(updatedMenuItem)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.menuItemModel.delete({ id })
    if (!result) return res.status(404).json({ message: 'Menu item not found!' })
    return res.json({ message: 'Menu item deleted!' })
  }
}
