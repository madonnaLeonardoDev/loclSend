import { handleData } from "./fileHandling.js";

export let clientSocket = null;

export function userId(socket){
    return `${socket.remoteAddress}:${socket.remotePort}`
}

export let userType;

export function createSocket(socket, type = 'client'){    
    userType = type

    clientSocket = socket;
    //Incoming data handling
    socket.on('data', (chunk) => {
        handleData(chunk, socket)

        });

    socket.on('end', () => {
        console.log('Client disconnected');
        clientSocket = null
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });

}

export async function closeSocket(){
    if(!clientSocket || clientSocket.destroyed){
        console.log('Socket was already closed or null')
        return;
    }
    console.log('Closing Socket...')
    await new Promise((resolve) => {
        if (clientSocket.destroyed) return resolve();
        clientSocket.once('close', () => resolve())
        clientSocket.end()})
        console.log('Socket Closed Succesfully')
        clientSocket = null
    }