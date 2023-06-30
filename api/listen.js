
const app = require(`${__dirname}/app`)

const {PORT} = process.env;

app.listen(PORT, () => {
    console.log("Server is listening on port 9090")
})
