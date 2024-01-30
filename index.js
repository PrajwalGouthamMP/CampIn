const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.get('/', (req, res) => {
    res.send("Hello From the Home Page")
})
app.listen(3000, () => {
    console.log("Listening on port 3000")
})