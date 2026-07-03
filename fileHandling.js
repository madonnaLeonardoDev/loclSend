import { getTargetDir } from './rlCommands.js';
import path from 'path';
import  fs  from 'fs';
import { usersMap } from './server.js';
import { client } from './client.js';

function broadCastPacket(packet){
    const msgPacket = JSON.stringify({
                type: 'MSG',
                content: packet.content,
                timeStamp: packet.timeStamp,
                sender: packet.sender
            })  + '\n';

    for(const [userId, userData] of usersMap){
        if(userData.socket === 'server') continue;
        if(userId === packet.sender) continue
        if(userData.socket.writable){
            userData.socket.write(msgPacket)
        }
    }
}

let dataBuffer = '';

export function handleData(chunk, socket){
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
                if(packet.type === 'SERVER-MSG'){
                    console.log(`${packet.content} from ${packet.sender}`)
                    broadCastPacket(packet)
                }
                if(packet.type === 'MSG'){
                    console.log(`${packet.content} from ${packet.sender}`);
                }
            } catch (e){
                console.log(`The following error occured: ${e.message}`)
            }
        }   
}

