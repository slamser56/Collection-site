const express = require('express');
var cors = require('cors')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Controller = require('./controller');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config')
const session = require('express-session')
const CommentController = new Controller.CommentController();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const router = require('./routes')
const passportinit = require('./passport')

const whitelist = ['http://localhost:3000', 'https://collection-site.herokuapp.com']

app.use(cors({
  origin: whitelist,
  credentials: true,
}));

app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(session({
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
passportinit()

app.set('io', io)

app.use('/', [router.auth, router.account, router.collection, router.item, router.comment, router.like, router.tag, router.theme])

io.on('connection', (client) => {
  client.on('JoinToComment', (res) => {
    client.join(res.itemId);
  })
  client.on('sendmessage', async (message) => {
    await CommentController.create(message).then(res => {
      io.sockets.to(res.data.itemId).emit("newMessage", { data: res.data })
    })
  });
});

app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

module.exports = http;