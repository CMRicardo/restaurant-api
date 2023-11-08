import { createServer } from 'node:http'
import { readFile } from 'node:fs'

const processRequest = (req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Bienvenido a mi página!')
  } else if (req.url === '/terminal') {
    readFile('assets/Terminal.png', (err, data) => {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.statusCode = 500
        res.end('505 - Internal Server Error')
      } else {
        res.setHeader('Content-Type', 'image/png')
        res.end(data)
      }
    })
  } else {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.statusCode = 404
    res.end('404 - Not Found!')
  }
}

const server = createServer(processRequest)

const PORT = process.env.PORT || 1234

server.listen(PORT, console.log(`Listening on http://localhost:${PORT}`))
