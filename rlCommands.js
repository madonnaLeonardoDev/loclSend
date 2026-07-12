import net from 'net'
import { time, timeStamp } from 'console';
import  fs  from 'fs';
import path from 'path';
import {rl} from './main.js';
import { serverBoot, usersMap } from './server.js';
import { clientConnect } from './client.js';
import { postMessage } from './postMsg.js';
import { clientSocket, closeSocket, userId } from './socket.js';
//test
import { broadCastPacket } from './fileHandling.js';

//socket writing function



function checkValidArguments(item) {
    if(!item){
        return false;
    } else{
        return true
    }
}
function isValidHost(host) {
    const isIp = net.isIP(host) !== 0;
    const isHostname = /^[a-zA-Z0-9.-]+$/.test(host);
    return isIp || isHostname;
}

//FILE SAVING DIRECTORY

let targetDirectory = null;

export function getTargetDir(){
    return targetDirectory;
}

// rlCommands list
const rlCommands = {
    'test': [,(args, argsArray) => {
    }],
    'room': [,(args, argsArray) =>{
                        if(!args){
                                console.log('You need to pass at least a value')
                                return;
                            }
                        
                        let portArg;
                            if(!checkValidArguments(argsArray[0]) && !checkValidArguments(argsArray[1] && !checkValidArguments(argsArray[2]))){
                                console.log('Invalid Argument')
                                return
                            }
                            
                            portArg = argsArray[1]
                        if(argsArray[0] == 'create'){
                            if(/^\d+$/.test(portArg) && portArg.length === 4){
                                console.log(`Creating room on port ${portArg}`)
                                serverBoot(portArg)
                                return;
                            }
                            console.log('Invalid PORT')
                            serverBoot(8000);
                            return;
                        }
                        if(argsArray[0] == 'join'){
                            if(/^\d+$/.test(portArg) && portArg.length >= 1 && portArg.length <= 5){
                                if(isValidHost(argsArray[2]) && argsArray[2]){
                                    console.log(`Connecting to room ${argsArray[2]}:${portArg}`)
                                    clientConnect(portArg, argsArray[2])
                                }else{
                                    console.log('Invalid Host')
                                }
                                
                            return;
                            }
                            console.log('Invalid PORT')
                        }
                        console.log('Invalid Argument')
                        return;
                            }],
    'help': ['This is the Help message to be made still...'],
    'exit': [, () => {  
                                    closeSocket()
                                    
                                }],
    'msg': [,(args) => {
                            if(!args){
                                console.log('You need to pass at least a value')
                            } else {
                                postMessage('MSG', args)
                                console.log(`>>> ${args}`)
                            }
                        }],
    'file': [,(args, argsArray) => {
                            if(!args){
                                console.log('You need to pass at least a value')
                                return;
                            }
                            if(argsArray[0] == 'path'){
                                if(!argsArray[1]){
                                    console.log(`Insert a valid File Path`)
                                    return;
                                }
                               targetDirectory = argsArray[1];
                                if(targetDirectory === ''){
                                    console.log("Choose a File Path");
                                    return;
                                }
                                console.log(`Path set to ${targetDirectory}`)
                                return;
                            } 
                                const filePath = args;
                                fs.readFile(args, (err, data) => {
                                    if(err){
                                        console.log(`The following error occured: ${err.message}`);
                                        return;
                                    }

                                postMessage('SERVER-FILE', {
                                    fileName: path.basename(filePath),
                                    file: data.toString('base64')
                                })

                                })
                        }],
    'discover': [,async (args, argsArray) => {
        if(argsArray[0] === 'shout'){
            const {roomDiscoveryBc} = await import('./roomHostBroadcast.js')
            roomDiscoveryBc()
            return;
        }
        if(argsArray[0] === 'listen'){
            const {roomDiscoveryLs} = await import('./roomHostBroadcast.js')
            roomDiscoveryLs()
            return;
        }
    }]
}

export function executeCLICommands(key, args){
    const cmd = rlCommands[key]
    let argsArray;
    if(args && args.split(' ') !== ''){
        argsArray = args.split(' ');
    } else {
        argsArray = null;
    }
    
    if(!cmd){ console.log('Command not found use /help to see all the available commands');
        return
    } 

    //Command Message
    if(cmd[0]){
        console.log(rlCommands[key][0])
    }
    //Command Execution
    if(cmd[1]){
        rlCommands[key][1](args, argsArray)
    } 
}

