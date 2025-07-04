import { BaseEvent, SendMessageEvent } from '@/socket-server';
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!);

export default socket;

export enum SocketEvent {
    SEND_MESSAGE = 'send_message',
    GET_HISTORY = 'get_history',
    START_CHAT = 'chat_start'
}

export const sendMessage = (message: SendMessageEvent) => {
    socket.emit(SocketEvent.SEND_MESSAGE, message)
}

export const getHistory = (message: BaseEvent) => {
    socket.emit(SocketEvent.GET_HISTORY, message)
}

export const startChat = (message: BaseEvent) => {
    socket.emit(SocketEvent.START_CHAT, message)
}

export const turnOffGetHistory = () => {
    socket.off(SocketEvent.SEND_MESSAGE)
}
