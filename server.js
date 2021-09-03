const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('start.ejs')
})

app.get('/en', (req, res) => {
  res.render('index.ejs')
})

app.get('/jp', (req, res) => {
  res.render('index-jp.ejs')
})

app.get('/start', (req, res) => {
  res.render('choose.ejs')
})

app.get('/about', (req, res) => {
  res.redirect(`/${uuidV4()}`)
  
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId:  req.params.room})
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('user-connected', userId)

      socket.on('disconnect', () => {
          socket.broadcast.to(roomId).emit('user-disconnected', userId)

      })
  })
})


server.listen(3000)
