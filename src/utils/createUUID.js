import { connection } from './db-connection.js'

export const createUUID = async () => {
  const [uuidResult] = await connection.query('SELECT UUID() uuid;')
  const [{ uuid }] = uuidResult
  return uuid
}
