var express = require('express')
var development = require('../knexfile').development
var knex = require('knex')(development)
var passport = require ('passport')
var db = require('../db/db')
var {ensureLoggedIn} = require('connect-ensure-login')
var auth = require('basic-auth')
var manwin = require('../lib/manwin')

var router = express.Router()
module.exports = router

router.get("/" , (req, res) => {
  db.getAllUsers()
    .then(function (users) {
      res.render('index', { users: users })
    })
    .catch(function (err) {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

router.get("/login", (req, res) => {
  res.render('login')
})

router.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.get('/secret',
  ensureLoggedIn("/login"),
  (req, res) => {
    res.send("I know what you did last summer!")
  }
)

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  db.create(req.body.username, req.body.email, req.body.password)
    .then(() => res.redirect('/login'))
    .catch(err => console.log(err))
})

router.get('/api', (req, res) => {
  var credentials = auth(req)
  if (!credentials) {
    res.send('You shall not pass!')
  }
  credentialOK(credentials, function (result) {
    if (result) {
      res.send('Access Granted')
    } else {
      res.send('You shall not pass!')
    }
  })
})

function credentialOK (credentials, callback) {
  manwin.strategy(credentials.name, credentials.pass, function(err, user) {
    if (err) {
      callback(false)
    }
    if (user) {
      callback(true)
    } else {
      callback(false)
    }
  })
}
