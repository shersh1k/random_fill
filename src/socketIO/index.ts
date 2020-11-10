import openSocket from 'socket.io-client';

const uri = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/'
console.log('new Socket')
export const socket = openSocket(uri, {
    transports: ['websocket'],
    path: '/socket'
});
