const express = require ('express')
const consign = require ('consign')

const app = express ()

app.use (express.urlencoded({ extended: false }))
app.use (express.json())

consign()
.include('./routes')
.include('./utils')
.into(app)

app.listen (
    3000,
    '127.0.0.1',
    () => console.log ('http://127.0.0.1:3000')
)