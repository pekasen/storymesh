express = require('express')

const app = express()
const port = 8081

app.use(express.static('test'))
app.use(express.static('dist'))

app.listen(port, () => {
    console.log(`We're live on port ${port}`)
})