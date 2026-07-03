import { getTargetDir } from './rlCommands.js';
import path from 'path';
import  fs  from 'fs';

let dataBuffer = '';

export function handleData(chunk){

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
}