const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app=express();
const port= process.env.PORT ;


const users=[{}];

app.use(cors());
app.get("/",(req,res)=>{
    res.send("HELL ITS WORKING");
})

const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({user})=>{
          users[socket.id]=user;
          console.log(`${user} has joined `);
          socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
          socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnect',()=>{
          socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
});


server.listen(4500,()=>{
    console.log(`Working`);
})






/*const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();

//otherwise it can choose itself
const port = 4500 || process.env.PORT;

const users=[{}];

app.use(cors());


app.get("/",(req,res)=>{
    res.send("Hell its working");
})

const server = http.createServer(app);

const io = socketIO(server);

//when circuit is on
io.on("connection",(socket)=>{
    console.log("New connection");



    //har socket ki alag id hoti hai agar dusra user join karega to uski id alag hogi
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined`);
         //like agar do log chat kar rahe hain and koi teesra a jata hai to baki sabke device par message ayega that user has joined but naye insan k device par nahi
        socket.broadcast.emit('userJoined',{user:"Admin", message:`${users[socket.id]} has joined`})
            //socket.emit facilitates real-time communication, allowing changes or messages to be instantly sent and received without the need for the client to repeatedly poll the server for updates.

        socket.emit('welcome' ,{user:"Admin", message:`Welcome to the chat,${users[socket.id]}`});
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })



    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin", message: `${users[socket.id]} has left`})
        console.log(`user left`);
    })

})



server.listen(port,()=>{
    console.log(`Server is working on https://localhost:${port}`);

})*/