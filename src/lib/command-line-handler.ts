import { readFileSync } from 'fs';
import { Main } from './main';

export class CommandLineHandler {

    private main: Main;
    private commandLine: Array<string>;

    constructor(argv: any) {
        this.commandLine =argv;
    }

    process() {
        this.processConfigFile();
        switch (this.commandLine [2]) {
            case 'run':
                this.main.run();
                break;
            case '--config':
                console.log(`Loaded config file into the system.`);
                break;
            default:
                this.showError();
                break;
        }
    }

    private showError() {
        console.log(`Unknown parameters: ${this.commandLine} `);
        console.log(`Arguments should be: command [run] --config path_to_config_file`);
    }

    private processConfigFile() {
        const configLoc = this.commandLine.indexOf('--config');
        if (configLoc < 0 ) {
            this.showError();
            throw Error;
        }
        const fileName = this.commandLine[configLoc + 1];
        this.main = new Main(JSON.parse(readFileSync(fileName, {encoding: 'UTF-8'})));
    }

    public getMain(): Main {
        return this.main;
    }
}