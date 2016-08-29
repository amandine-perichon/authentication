var bodyParser = require('body-parser')
var express = require('express')
var hbs = require('express-handlebars')
var path = require('path')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var manwin = require('./lib/manwin')

var index = require('./routes/index')

var PORT = 3000

var app = express()
app.engine('hbs', hbs())
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'hello'
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(manwin.strategy))
passport.serializeUser(manwin.serialize)
passport.deserializeUser(manwin.deserialize)

app.use('/', index)

app.listen(PORT, function () {
  console.log('Listening on port', PORT)
})
