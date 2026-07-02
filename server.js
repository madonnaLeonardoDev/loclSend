import { time, timeStamp } from 'console';
import  fs  from 'fs';
import net from 'net'
import path from 'path';
import readline from 'readline';
import { getTargetDir } from './rlCommands.js';

export let PORT = 8000;
const HOST = '0.0.0.0';
export let activeSocket = null;

export function setPort(newPort){
    PORT = newPort;
}
const server = net.createServer((socket) => {
    console.log('Client connected:', socket.remoteAddress);
    activeSocket = socket;

    let dataBuffer = '';

    socket.on('data', (chunk) => {
        dataBuffer += chunk.toString();
    while (dataBuffer.indexOf('\n') !== -1) {
        const newlineIndex = dataBuffer.indexOf('\n');
        const message = dataBuffer.slice(0, newlineIndex);
        dataBuffer = dataBuffer.slice(newlineIndex + 1);
            try{
                const packet = JSON.parse(message)
    
                if(packet.type === 'FILE'){
                    
                    console.log(`Recieving FILE ${packet.content.fileName}`);
    
                    const fileBuffer = Buffer.from(packet.content.file, 'base64');

                    const fileName = packet.content.fileName;
                    const targetDirectory = getTargetDir();
                    if(!targetDirectory){
                        throw new Error('Choose a filepath first (/file --path <PATH>')
                    }
                    // 3. Combine the directory and the filename
                    const savePath = path.join(process.cwd(), targetDirectory, fileName);
                    
                    fs.writeFile(savePath, fileBuffer, (err) => {
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

export function serverBoot(arg = PORT){
   try{
    server.listen(arg, HOST, () => {
        if(arg === 8000){
            console.log(`Server listening on default port ${HOST}:${arg}`);
        } else {
            console.log(`Server listening on ${HOST}:${arg}`);
        }
    
    });
   } catch(e){
    console.log(`The following error occured: ${e.message}`)
   }
}



export function serverReboot() {
    try{
        server.close(() => {
        console.log('Waiting 500ms to clear port...')

        setTimeout(() => {
            server.listen(PORT, HOST, () => {
                console.log(`Server listening on ${HOST}:${PORT}`);
            });
        }, 500)
    })
    } catch(e){
        console.log(`Something went wrong: ${e}`)
    }
    

}
