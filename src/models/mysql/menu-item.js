import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'restaurant',
  decimalNumbers: true
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
// const connectionString = DEFAULT_CONFIG
const connection = await mysql.createConnection(connectionString)

export class MenuItemModel {
  static async getAll ({ category }) {
    if (category) {
      const lowerCaseCategory = category.toLowerCase()
      const [menuItems] = await connection.query(`
        select
          BIN_TO_UUID(mitem.id) as id,
          ctg.category,
          name,
          description,
          price,
          imageUrl
        from menuItem as mitem join categoryMenuItem as ctg
        where mitem.idCategory = ctg.id and LOWER(ctg.category) = ?;
      `, lowerCaseCategory)

      return menuItems.length > 0 ? menuItems : []
    }

    const [menuItems] = await connection.query(`
      select
        BIN_TO_UUID(mitem.id) as id,
        ctg.category,
        name,
        description,
        price,
        imageUrl
      from menuItem as mitem join categoryMenuItem as ctg
      where mitem.idCategory = ctg.id;
    `)

    return menuItems.length > 0 ? menuItems : []
  }

  static async getById ({ id }) {
    const [result] = await connection.query(`
      select
        BIN_TO_UUID(mitem.id) as id,
        ctg.category,
        name,
        description,
        price,
        imageUrl
      from menuItem as mitem join categoryMenuItem as ctg
      where mitem.idCategory = ctg.id and mitem.id = UUID_TO_BIN(?);
    `, [id])

    return result[0]
  }

  static async create ({ input }) {
    const {
      category,
      name,
      description,
      price,
      imageUrl
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    try {
      await connection.query(`
        insert into menuItem
          (idCategory, name, description, price, imageUrl, id)
        values
        (
          (select id from categoryMenuItem where category = ?),
          ?, ?, ?, ?, UUID_TO_BIN(?)
        );
      `, [category, name, description, price, imageUrl, uuid])
    } catch (error) {
      return false
    }

    const newMenuItem = await this.getById({ id: uuid })
    return newMenuItem
  }

  static async update ({ id, input }) {
    const originalMenuItem = await this.getById({ id })
    const updatedMenuItem = {
      ...originalMenuItem,
      ...input
    }
    const {
      category,
      name,
      description,
      price,
      imageUrl
    } = updatedMenuItem

    try {
      await connection.query(`
        update menuItem
        set
          idCategory = (select id from categoryMenuItem where category = ?),
          name = ?,
          description = ?,
          price = ?,
          imageUrl = ?
        where
          id = UUID_TO_BIN(?);
      `, [category, name, description, price, imageUrl, id])
      return updatedMenuItem
    } catch (error) {
      return false
    }
  }

  static async delete ({ id }) {
    try {
      await connection.query(`
        delete from menuItem
        where id = UUID_TO_BIN(?);
      `, [id])
      return true
    } catch (error) {
      return false
    }
  }
}
