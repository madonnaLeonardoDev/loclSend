import { time, timeStamp } from 'console';
import  fs  from 'fs';
import net from 'net'
import path from 'path';
import readline from 'readline';

export let PORT = 8000;
const HOST = '0.0.0.0'; // Listens on all available network interfaces

export let activeSocket = null;

const server = net.createServer((socket) => {
    console.log('Client connected:', socket.remoteAddress);
    activeSocket = socket;

    let dataBuffer = '';
    // This triggers whenever data comes through the pipe
    socket.on('data', (chunk) => {
            
        
            
        dataBuffer += chunk.toString(); // Add new data to the buffer

    // While there is a newline in the buffer, process each full message
    while (dataBuffer.indexOf('\n') !== -1) {
        const newlineIndex = dataBuffer.indexOf('\n');
        const message = dataBuffer.slice(0, newlineIndex);
        dataBuffer = dataBuffer.slice(newlineIndex + 1);
            try{
                const packet = JSON.parse(message)
    
                if(packet.type === 'FILE'){
                
                    
                    console.log(`Recieving FILE ${packet.content.fileName}`);
    
                    const fileBuffer = Buffer.from(packet.content.file, 'base64');
    
                    fs.writeFile(packet.content.fileName, fileBuffer, (err) => {
                        if (err) console.error("Write error:", err);
                        else console.log("File saved successfully!");
                    })
                return;
                }
                if(packet.type === 'MSG'){
                    console.log(packet.content);
                }
            } catch (e){
                console.log(`The following error occured: ${e.message}`)
            }
        }     
        });

    socket.on('end', () => {
        console.log('Client disconnected');
        activeSocket = null
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});

