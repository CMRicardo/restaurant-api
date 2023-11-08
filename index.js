import { createServer } from 'node:http'

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  if (req.url === '/') {
    res.end('Bienvenido a mi página!')
  } else if (req.url === '/contact') {
    res.end('Contacto!')
  } else {
    res.statusCode = 404
    res.end('404 - Not Found!')
  }
}

const server = createServer(processRequest)

const PORT = process.env.PORT || 1234

server.listen(PORT, console.log(`Listening on http://localhost:${PORT}`))
