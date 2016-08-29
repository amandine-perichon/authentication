var db = require('../db/db')
var bcrypt = require('bcrypt')

module.exports = {
  strategy,
  serialize,
  deserialize
}

function serialize (user, done) {
  done(null, user.id)
}

function deserialize (id, done) {
  db.getUserById(id)
    .then(users => {
      if (users.length === 0) {
        return done(null, false)
      }
      done(null, users[0])
    })
    .catch(err => {
      done(err, false)
    })
}

function strategy (username, password, done) {
  db.getUserByName(username)
    .then(users => {
      if (users.length === 0) {
        return done(null, false)
      }
      if(!bcrypt.compareSync(password, users[0].hash)){
        return done(null, false)
      }
      done(null, users[0])
    })
    .catch(err => {
      done(err, false)
    })
}
