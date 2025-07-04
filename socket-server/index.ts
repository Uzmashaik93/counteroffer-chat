import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();

export interface BaseMessage {
    id: string;
}

export interface CounterOffer extends BaseMessage {
    type: "counter_offer";
    sender: "buyer" | "seller";
    amount: number;
    timestamp: string;
    status: "pending" | "accepted" | "rejected" | "history";
}

export interface Message extends BaseMessage {
    type: "message";
    sender: "buyer" | "seller";
    message: string;
    timestamp: string;
}


export interface UpdateOfferEvent extends BaseEvent {
    offer?: Omit<CounterOffer, 'id'>;
    messageId: string;
    status: "pending" | "accepted" | "rejected" | "history";
}

export interface Chat {
    id: string;
    buyerId: string;
    sellerId: string;
    messages: Message[];
    counterOffers: CounterOffer[];
}

export interface BaseEvent {
    sellerId: string;
    buyerId: string;
}

export interface SendMessageEvent extends BaseEvent {
    message: Omit<Message, 'id'>
}


const chats: Chat[] = [];

const app = express();
app.use(cors({
    origin: [process.env.FRONTEND_URL!]
}));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    },
});


io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('chat_start', ({ sellerId, buyerId }: BaseEvent) => {
        console.log('chat_start')
        const isChatExist = chats.find((chat) => {
            return chat.sellerId === sellerId && chat.buyerId === buyerId
        })

        if (!isChatExist) {
            const newChat: Chat = {
                id: nanoid(),
                sellerId,
                buyerId,
                counterOffers: [],
                messages: []
            }
            chats.push(newChat)
        }
        console.log('chat', chats)
    })

    socket.on('get_history', ({ sellerId, buyerId }: BaseEvent) => {
        console.log(sellerId, buyerId)
        const chat = chats.find((chat) => {
            return chat.sellerId === sellerId && chat.buyerId === buyerId
        })
        console.dir('History requested');
        // Emit the entire message history to the client
        socket.emit('message_history', chat);
    })

    socket.on('send_message', ({ sellerId, buyerId, message }: SendMessageEvent) => {
        console.log('send_message')
        const chat = chats.find((chat) => {
            return chat.sellerId === sellerId && chat.buyerId === buyerId
        })
        console.log('Message:', message);
        chat?.messages.push({
            ...message,
            timestamp: new Date().toISOString(),
            id: nanoid()
        });
        console.log(chat)
        io.emit('receive_message', chat);
    });

    socket.on(
        'update_counter_offer',
        ({ sellerId, buyerId, offer, messageId, status }: UpdateOfferEvent) => {
            console.log('update_counter_offer');

            const chat = chats.find(
                (chat) => chat.sellerId === sellerId && chat.buyerId === buyerId
            );

            if (chat) {
                // Update status of the specific counter offer by messageId
                chat.counterOffers = chat.counterOffers.map((o) =>
                    o.id === messageId ? { ...o, status } : { ...o, status: "history" }
                );

                // Add new offer only if 'offer' exists
                if (offer) {
                    chat.counterOffers.push({
                        ...offer,
                        timestamp: new Date().toISOString(),
                        id: nanoid(),
                    });
                }

                io.emit('receive_message', chat);
            }
        }
    );

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || "4000";
server.listen(PORT, () => {
    console.log(`Socket.IO server running at http://localhost:${PORT}`);
});
