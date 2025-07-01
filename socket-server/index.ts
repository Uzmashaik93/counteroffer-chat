import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

export interface CounterOffer {
    type: "counter_offer";
    sender: "buyer" | "seller";
    amount: number;
    timestamp: number;
    status: "pending" | "accepted" | "rejected";
}

export interface RegularMessage {
    type: "message";
    sender: "buyer" | "seller";
    message: string;
}

export type Message = CounterOffer | RegularMessage;


const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    },
});

const messages: Message[] = [];

io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('send_message', (message: Message) => {
        console.log('Message:', message);
        //some actions
        messages.push(message);
        io.emit('receive_message', messages);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running at http://localhost:${PORT}`);
});
