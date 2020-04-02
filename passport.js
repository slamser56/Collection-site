const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config')
const model = require('./model')

const AccountModel = model.account

module.exports = () => {

  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((obj, cb) => cb(null, obj))

  const callback = (accessToken, refreshToken, profile, cb) => cb(null, profile)

  passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_clientID,
    clientSecret: config.GOOOGLE_clientSecret,
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://collection-site.herokuapp.com/auth/google/callback': 'http://localhost:5000/auth/google/callback'
  },
    callback
  ))

  

  var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://collection-site.herokuapp.com/auth/github/callback': 'http://localhost:5000/auth/github/callback'
  },
  callback
));




}



