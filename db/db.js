var development = require('../knexfile').development
var knex = require('knex')(development)
var bcrypt = require('bcrypt')
var saltRounds = 10



module.exports = {
  create,
  getAllUsers,
  getUserById,
  getUserByName
}

function create (username, email, password) {
  password = bcrypt.hashSync(password, saltRounds)
  return knex('users')
    .insert({name: username, email: email, hash: password})
}

function getAllUsers () {
  return knex('users')
    .select()
}

function getUserById (id) {
  return knex('users')
    .select({id: id})
}

function getUserByName (username) {
  return knex('users')
    .select()
    .where({name: username})
}
