import { readFileSync } from 'fs';
import { ConfigModel } from '../models/config-model';
import { Main } from './main';
import { ProcessState } from '../models/process-state';

export class CommandLineHandler {

    private commandLine: Array<string>;
    private runningProcessess: Array<ProcessState>;

    constructor(argv: any, runningProcessList: Array<ProcessState>) {
        console.log(argv);
        this.commandLine =argv;
        this.runningProcessess = runningProcessList;
    }

    process() {
        switch (this.commandLine [2]) {
            case 'run':
                this.processConfigFile();
                break;
        
            default:
                this.showError();
                break;
        }
    }

    private showError() {
        console.log(`Unknown parameters: ${this.commandLine} `);
    }

    private processConfigFile() {
        const configLoc = this.commandLine.indexOf('--config');
        if (configLoc < 0 ) {
            this.showError();
            throw Error;
        }
        const fileName = this.commandLine[configLoc + 1];
        const main: Main = new Main(this.runningProcessess);
        main.run(JSON.parse(readFileSync(fileName, {encoding: 'UTF-8'})));
    }


}