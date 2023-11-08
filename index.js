import { createServer } from 'node:http'

const server = createServer((req, res) => {
  console.log('Request received!')
  res.end('Hola mundo!')
})

const PORT = process.env.PORT || 1234

server.listen(PORT, console.log(`Listening on http://localhost:${PORT}`))
