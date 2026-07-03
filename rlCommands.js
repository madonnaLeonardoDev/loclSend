import { time, timeStamp } from 'console';
import  fs  from 'fs';
import path from 'path';
import {rl} from './main.js';
import { PORT, serverReboot, setPort, serverBoot } from './server.js';
import { clientConnect } from './client.js';
import { postMessage } from './postMsg.js';
import { closeSocket } from './socket.js';



//socket writing function



function checkValidArguments(array, index) {
    if(!array[index]){
        console.log('Invalid Argument')
        return;
    }
}

//FILE SAVING DIRECTORY

let targetDirectory = null;

export function getTargetDir(){
    return targetDirectory;
}

// rlCommands list
const rlCommands = {
    'test': [,(args, argsArray) => {
        console.log(`These are the ARGS ${args}`)
        console.log(`This is the ARGS ARRAY ${argsArray}`)
    }],
    'room': [,(args, argsArray) =>{
                        if(!args){
                                console.log('You need to pass at least a value')
                                return;
                            }
                        
                        let portArg;
                            checkValidArguments(argsArray, 0)
                            checkValidArguments(argsArray, 1)
                            portArg = argsArray[1]
                        if(argsArray[0] == '--create'){
                            if(/^\d+$/.test(portArg) && portArg.length === 4){
                                console.log(`Creating room on port ${portArg}`)
                                serverBoot(portArg)
                                return;
                            }
                            console.log('Invalid PORT')
                            serverBoot();
                            return;
                        }
                        if(argsArray[0] == '--join'){
                            if(/^\d+$/.test(portArg) && portArg.length === 4){
                                console.log(`Connecting to room on port ${portArg}`)
                                clientConnect(portArg)
                            return;
                            }
                            console.log('Invalid PORT')
                            clientConnect();
                            return;
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
                            if(argsArray[0] == '--path'){
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

                                postMessage('FILE', {
                                    fileName: path.basename(filePath),
                                    file: data.toString('base64')
                                })

                                })
                        }],
    'reboot': ['Rebooting Server...', () => serverReboot()],
    // /port --set doesnt work yet since i need to implement reboot of the server
    'port': [,(args, argsArray) => {
        if(!args){
            console.log(PORT)
            return;
        };
        if(argsArray[0] === '--set'){
            const portArg = argsArray[1];

            //THIS IF CHECKS IF ARGS IS A NUMBER OF 4 DIGITS LENGTH
           if(/^\d+$/.test(portArg) && portArg.length === 4){
            setPort(portArg)
            serverReboot()
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

