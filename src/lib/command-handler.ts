import { ReadLine, createInterface } from 'readline';
import { ProcessState } from '../models/process-state';
import { Main } from './main';
import { Process } from '../models/process';

export class CommandHandler {
    private main: Main;

    private readline: ReadLine =  createInterface({
        input: process.stdin,
        output: process.stdout
    });

    constructor() {
    }

    listenToCommand(main: Main) {
        this.main = main;
        console.log(`Waiting for command. Type '?' for help`);
        this.readline.on('line', (input) => {
            this.commandInterpreter(input);
        });
        this.readline.on('close', () => {
            console.log(`Bye!!! All opened processess may be still running`);
        });
        this.readline.on('SIGCONT', () => {
            console.log(`Waiting for command. Type '?' for help`);
        });
        this.readline.on('SIGINT', () => {
            this.readline.close();
        });

    }

    private commandInterpreter(command: string) {
        let subCommand = '';
        let args = '';
        let firstIndexOfSpace = command.trim().indexOf(' ');
        if (firstIndexOfSpace < 0) {
            subCommand = command;
        } else {
            subCommand = command.split(' ', 1)[0];
            args = command.substring(firstIndexOfSpace + 1, command.length);
        }
        switch (subCommand) {
            case '?':
                this.showHelp();
                break;
            case 'exit':
                this.readline.close();
                break;
            case 'bye':
                this.readline.close();
                break;
            case 'listAll':
                this.listAll();
                break;
            case 'kill':
                this.kill(args);
                break;
            case 'killAll':
                this.main.killAll();
                break;
            case 'start':
                this.main.start(args);
                break;
            case 'startAll':
                this.main.startAll();
                break;
            case 'find':
                this.find(args);
                break;
            default:
                this.showHelp();
                break;
        }
    }

    private showHelp() {
        console.log(`Showing options:`);
        console.log(`?:                  \tShows help screen.`);
        console.log(`find [xxxx]:        \tFinds the process matching the pattern xxxx`);
        console.log(`kill xxxx:          \tKills the process associated with PID xxxx`);
        console.log(`killAll:            \tKills all process started and their status`);
        console.log(`listAll:            \tLists all process started and their status`);
        console.log(`start service name: \tStarts the service identified by the name. If the service is started already, it will ignore the command`);
        console.log(`startAll:           \tStarts all the services. If the service is started already, it will ignore the command`);
        console.log(`exit || bye:        \tExits the programme. !!All opened processess may be still running!!`);
        console.log();
    }

    private listAll() {
        console.log(`PID \tNAME \tSTATUS`);
        console.log(`---------------------------------------------------------------------------`);
        this.main.getRunningProcessess().forEach((state: ProcessState) => {
            console.log(`${state.processId}\t${state.name}\t${state.status}`);
        });
    }

    private kill(command: string) {
        console.log(command);
        this.main.kill(Number(command));
        
    }

    private find(name: string) {
        console.log(`NAME`);
        console.log(`-----`)
        this.main.getProcessFromConfigFileByLikeName(name).then((value: Array<Process>) => {
            value.forEach((process: Process) => {
                console.log(process.name);
            });
            console.log();
        }).catch( (error: Error) => {
            console.log(error);
        });
    }
}