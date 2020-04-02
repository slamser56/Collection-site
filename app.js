const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Controller = require('./controller');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config')
const session = require('express-session')
const AccountController = new Controller.AccountPostController();
const CollectionController = new Controller.CollectionController();
const ItemController = new Controller.ItemController();
const ThemeController = new Controller.ThemeController();
const UploadImage = new Controller.UploadImage();
const TagController = new Controller.TagController();
const CommentController = new Controller.CommentController();
const LikeController = new Controller.LikeController();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const router = require('./routes')
const passportinit = require('./passport')


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

app.use('/', router.auth)

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


app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
});


app.post('/CreateAccount', AccountController.signup);
app.post('/SignIn', AccountController.get);
app.post('/VerifyToken', AccountController.verify);
app.post('/GetAllAccount', AccountController.getAllAccount);
app.post('/DeleteAccount', AccountController.delete);
app.post('/BlockAccount', AccountController.block);
app.post('/UnBlockAccount', AccountController.unblock);
app.post('/SetAdmin', AccountController.setadmin);
app.post('/UnSetAdmin', AccountController.unsetadmin);
app.post('/getProfile', AccountController.getProfile);

app.post('/CreateCollection', CollectionController.create);
app.post('/DeleteCollection', CollectionController.delete);
app.post('/UpdateCollection', CollectionController.update);
app.post('/FindCollection', CollectionController.find);
app.post('/GetCollectionUser', CollectionController.GetCollectionUser);
app.post('/CollectionMostItem', CollectionController.CollectionMostItem);
app.post('/search', CollectionController.search);

app.post('/CreateItem', ItemController.create);
app.post('/DeleteItem', ItemController.delete);
app.post('/UpdateItem', ItemController.update);
app.post('/FindItem', ItemController.find);
app.post('/FindItems', ItemController.findItems);
app.post('/LastAddedItem', ItemController.LastAddedItem);

app.post('/FindTheme', ThemeController.find);
app.post('/FindThemeOne', ThemeController.findOne);

app.post('/UploadImage', UploadImage.upload);

app.post('/CreateTag', TagController.create);
app.post('/FindTags', TagController.findalltags);
app.post('/GetAllTags', TagController.getalltags);
app.post('/UpdateTags', TagController.update);

app.post('/CreateComment', CommentController.create);
app.post('/GetComment', CommentController.get);

app.post('/SetLike', LikeController.set);
app.post('/UnSetLike', LikeController.unset);
app.post('/GetLike', LikeController.get);


module.exports = http;