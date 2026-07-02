import net from 'net';
import fs from 'fs'

const client = new net.Socket();
const PORT = 8000;
const HOST = '127.0.0.1'; // 'localhost'

client.connect(PORT, HOST, () => {
    console.log('Connected to server!');
    
    // Testing your protocol:
    const packet = { type: 'MSG', content: 'Hello from the client!' };
    client.write(JSON.stringify(packet));
});

    let dataBuffer = '';

    client.on('data', (chunk) => {
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

client.on('close', () => {
    console.log('Connection closed');
});