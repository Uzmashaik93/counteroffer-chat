import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Match your backend port

export default socket;
