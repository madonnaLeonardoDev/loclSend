import { time, timeStamp } from 'console';
import  fs  from 'fs';
import path from 'path';
import {rl} from './main.js';
import { activeSocket, PORT } from './server.js';



//socket writing function

function postMessage(type, content){
    if(!activeSocket){
        console.log('No client connected to the pipe');
        return;
    } 
    const packet = {
        type: type,
        content: content,
        timeStamp: Date.now()
    }

    activeSocket.write(JSON.stringify(packet) + '\n')
    console.log('SUCCESFULLY SENT the following packet')
    console.log(packet)
}


// rlCommands list
const rlCommands = {
    'help': ['This is the Help message to be made still...'],
    'exit': ['Closing...', () => {
                                    if(activeSocket){
                                        activeSocket.end(() => {
                                            console.log('Closing Socket...');
                                            rl.close()
                                            process.exit(0)
                                        });
                                        
                                    } else {
                                        rl.close()
                                        process.exit(0)
                                    }
                                    
                                }],
    'msg': [,(args) => {
                            if(!args){
                                console.log('You need to pass at least a value')
                            } else {
                                postMessage('MSG', args)
                                console.log(`>>> ${args}`)
                            }
                        }],
    'file': [,(args) => {
                            if(!args){
                                console.log('You need to pass at least a value')
                            } else {
                                const filePath = args;
                                fs.readFile(args, (err, data) => {
                                    if(err){
                                        console.log(`The following error occured: ${err.message}`);
                                        return;
                                    }

                                postMessage('FILE', {
                                    fileName: path.basename(filePath),
                                    file: data.toString('base64')
                                })

                                })
                            }
                        }],
    // /port --set doesnt work yet since i need to implement reboot of the server
    'port': [,(args) => {
        if(!args){
            console.log(PORT)
            return;
        };
        if(args.slice(0,5) === '--set'){
            const portArg = args.slice(args.lastIndexOf(' ') + 1)

            //THIS IF CHECKS IF ARGS IS A NUMBER OF 4 DIGITS LENGTH
           if(/^\d+$/.test(portArg) && portArg.length == 4){
            PORT = portArg;
            console.log(`PORT SUCCESFULLY SET TO: ${portArg}`)
           } else {
            console.log(`PORT: ${portArg} is an invalid port`)
           }

         } else {
            console.log('Invalid arg')
        }
    }]
}

export function executeCLICommands(key, args){
    const cmd = rlCommands[key]

    if(!cmd){ console.log('Command not found use /help to see all the available commands');
        return
    } 

    //Command Message
    if(cmd[0]){
        console.log(rlCommands[key][0])
    }
    //Command Execution
    if(cmd[1]){
        rlCommands[key][1](args)
    } 
}