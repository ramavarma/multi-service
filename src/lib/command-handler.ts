import { ReadLine, createInterface } from 'readline';
import { ProcessState } from '../models/process-state';
import { Main } from './main';

export class CommandHandler {
    private runningProcessess: Array<ProcessState>;
    private main: Main;

    private readline: ReadLine =  createInterface({
        input: process.stdin,
        output: process.stdout
    });

    constructor(runningProcessList: Array<ProcessState>) {
        this.runningProcessess = runningProcessList;
        this.main = new Main(runningProcessList);
    }

    listenToCommand() {
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
        let commands: Array<string> = new Array<string>();
        let subCommand = '';
        let args = '';
        commands = command.split(' ');
        // console.log(`Length of command: ${commands.length}`);
        if (command.split(' ').length > 1) {
            subCommand = commands[0];
            args = commands[1];
        } else {
            subCommand = command;
        };
        // console.log(`Sub Command: ${subCommand}`);
        // console.log(`Args: ${args}`);
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
            default:
                this.showHelp();
                break;
        }
    }

    private showHelp() {
        console.log(`Showing options:\n`);
        console.log(`?:          \tShows help screen.\n`);
        console.log(`kill xxxx:  \tKills the process associated with PID xxxx\n`);
        console.log(`killAll:    \tLists all process started and their status\n`);
        console.log(`listAll:    \tLists all process started and their status\n`);
        console.log(`exit || bye:\tExits the programme. !!All opened processess may be still running!!\n`);
        console.log();
    }

    private listAll() {
        console.log(`PID \tNAME \tSTATUS`);
        console.log(`---------------------------------------------------------------------------`);
        this.runningProcessess.forEach((state: ProcessState) => {
            console.log(`${state.processId}\t${state.name}\t${state.status}`);
        });
    }

    private kill(command: string) {
        console.log(command);
        this.main.kill(Number(command));
        
    }
}