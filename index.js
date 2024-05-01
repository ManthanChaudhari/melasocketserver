import express from "express";
import { Server } from "socket.io";
import {createServer} from "http"
import cors from "cors"

const port =  process.env.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors : {
        origin : "https://chat-web-app-alpha.vercel.app",
        methods : ["GET" , "POST"],
        credentials : true
    }
})

app.get("/" , (req,res) => {
    res.send("Hello World!");
});

app.use(cors({
        origin : "https://chat-web-app-alpha.vercel.app",
        methods : ["GET" , "POST"],
        credentials : true
}));

io.on("connection" , (socket) => {
    console.log("User Connected");
    console.log("id" , socket.id);
   
    socket.on("message" , ({userData , user , singleMessage}) => {
        console.log(`${userData.name}  :  ${singleMessage}`);
        io.to(user).emit("receive-msg" , {userData , singleMessage });
    })
    socket.on("join-user" , ({userData , roomCode}) => {
        socket.join(roomCode);
        io.to(roomCode).emit("user-joined" , userData);
    })
    socket.on("disconnect" , () => {
        console.log("User Disconnected" , socket.id);
        socket.broadcast.emit("disconnected" , socket.id);
    })
})
server.listen(port , () => {
    console.log(`Server is running on port ${port}`);
});
