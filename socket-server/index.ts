import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { nanoid } from 'nanoid';

export interface BaseMessage {
    id: string;
}

export interface CounterOffer extends BaseMessage {
    type: "counter_offer";
    sender: "buyer" | "seller";
    amount: number;
    timestamp: string;
    status: "pending" | "accepted" | "rejected";
}

export interface RegularMessage extends BaseMessage {
    type: "message";
    sender: "buyer" | "seller";
    message: string;
    timestamp: string;
}

export type Message = CounterOffer | RegularMessage;

export interface UpdateCounterOfferPayload {
    messageId: string;
    status: "accepted" | "rejected";
    newMessage?: CounterOffer;
}

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


    socket.on('get_history', () => {
        console.log('History requested');
        // Emit the entire message history to the client
        socket.emit('message_history', messages);
    })

    socket.on('send_message', (message: Message) => {
        console.log('Message:', message);
        messages.push({
            ...message,
            timestamp: new Date().toISOString(),
            id: nanoid()
        });
        io.emit('receive_message', messages);
    });

    socket.on('update_counter_offer', ({ messageId, status, newMessage }: UpdateCounterOfferPayload) => {
        const existingMessageIndex = messages.findIndex(
            (msg) => msg.id === messageId && msg.type === 'counter_offer'
        );

        if (existingMessageIndex !== -1) {
            messages[existingMessageIndex] = {
                ...messages[existingMessageIndex],
                status: status,
            } as CounterOffer;
        }

        if (newMessage) {
            messages.push({
                ...newMessage,
                timestamp: new Date().toISOString(),
                id: nanoid()
            });
        }

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
