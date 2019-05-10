const express = require('express')

const app = express()

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index')
})
.get('/today', (req, res) => {
  res.render('today', {employees})
})
.get('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id) - 1
  const employee = employees[id]
  res.render('stats', {employee})
})


const employees = [
  {id: 1, name: 'Fred Flintstone', hours: 35},
  {id: 2, name: 'Barney Rubble', hours: 40},
  {id: 3, name: 'Mr. Slate', hours: 38},
  {id: 4, name: 'Joe Rockhead', hours: 41},
  {id: 5, name: 'Stoney Curtis', hours: 3}
]

module.exports = app

