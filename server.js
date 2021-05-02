const express= require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express();

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

const posts =[ 
    {
        username: 'uma',
        title: 'coder'
    },
    {
        username: 'swathi',
        title: 'blogger'
    },
    {
        username: 'jagrav',
        title: 'youtubber'
    }
]

app.get("/posts", authenticatateToken, (req, res)=>{
    console.log(req.user)
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post("/login", (req, res)=>{
    const userName = req.body.username
    console.log(req.body)
    const user = { name : userName}
    const accessToken = jwt.sign(user, process.env.ACCESS_KEY_TOKEN)
    res.json({accessToken})
})

function authenticatateToken (req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1]
    console.log(authHeaders)
    console.log(token)
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_KEY_TOKEN, (err, user) =>{
        if(err) return res.sendStatus(403)
        console.log(user)
        req.user = user
        next()
    })

}

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server listening at PORT ${PORT}`)
})