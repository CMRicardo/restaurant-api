import { createServer } from 'node:http'

const processRequest = (req, res) => {
  const { method, url } = req
  switch (method) {
    case 'GET': {
      switch (url) {
        case '/':
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(`Hola desde ${url}`)
          break

        default:
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('404 - Not Found')
          break
      }
    }
  }
}
const server = createServer(processRequest)

server.listen(1234, () => {
  console.log('Server listening on http://localhost:1234')
})
