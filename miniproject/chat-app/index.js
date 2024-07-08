const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const session = require('express-session');
const authRoutes = require('./routes/auth');


const isAuthenticated = require('./utils/auth');
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'Superman@1',
    resave: false,
    saveUninitialized: true,
}));


mongoose.connect("mongodb://127.0.0.1:27017/chat-app")
.then(()=>{
    console.log('connected to mongodb');
})
.catch(err => {
    console.log('Failed to connect to mongodb', msg);
})


app.get('/chat',isAuthenticated ,(req, res) => {
    res.render("chat");
})

io.on('connection', (socket) => {
    console.log("A user connected");

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

app.use('/', authRoutes);


app.listen(3000);