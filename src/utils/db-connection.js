import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'restaurant',
  decimalNumbers: true
}
// const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const connectionString = DEFAULT_CONFIG
export const connection = await mysql.createConnection(connectionString)
