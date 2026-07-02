import { time, timeStamp } from 'console';
import  fs  from 'fs';
import net from 'net'
import path from 'path';
import readline from 'readline';
import { getTargetDir } from './rlCommands.js';
import os from 'os';

function getLocalIPv4() {
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Filter: Must be IPv4, not the loopback (internal) address
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

export let PORT = 8000;
const HOST = getLocalIPv4()

// 1. The client IS the active socket. We export it so rlCommands can use it.
export const client = new net.Socket();
export let activeSocket = client; 

export function setPort(newPort){
    PORT = newPort;
}

export function clientConnect(arg = PORT){
    try{
        if(arg === 8000){
                console.log(`Server listening on default port ${HOST}:${arg}`);
            } else {
                console.log(`Server listening on ${HOST}:${arg}`);
            }
    client.connect(arg, HOST, () => {
    console.log(`CONNECTED SUCCEFULLY TO ${arg}:${HOST}`)
})
    } catch(e){
        console.log(`The following error occured ${e.message}`)
    }
    
}


let dataBuffer = '';

// 2. Flattened Listeners: These sit outside the connection logic
 client.on('data', (chunk) => {
    dataBuffer += chunk.toString();
    while (dataBuffer.indexOf('\n') !== -1) {
        const newlineIndex = dataBuffer.indexOf('\n');
        const message = dataBuffer.slice(0, newlineIndex);
        dataBuffer = dataBuffer.slice(newlineIndex + 1);
        
        try {
            const packet = JSON.parse(message);
    
            if(packet.type === 'FILE'){
                console.log(`Receiving FILE ${packet.content.fileName}`);
                const fileBuffer = Buffer.from(packet.content.file, 'base64');
                const fileName = packet.content.fileName;
                const targetDirectory = getTargetDir();
                // BUG FIX: The check must happen BEFORE path.join
                if(!targetDirectory){
                    throw new Error('Choose a filepath first (/file --path <PATH>)');
                }
                
                const savePath = path.join(process.cwd(), targetDirectory, fileName);
                
                fs.writeFile(savePath, fileBuffer, (err) => {
                    if (err) console.error("Write error:", err);
                    else console.log("File saved successfully!");
                });
                
                return;
            }
            if(packet.type === 'MSG'){
                console.log(packet.content);
            }
        } catch (e){
            console.log(`The following error occurred: ${e.message}`);
        }
    }     
});
client.on('end', () => {
    console.log('Disconnected from server');
});

client.on('error', (err) => {
    console.error('Socket error:', err.message);
});