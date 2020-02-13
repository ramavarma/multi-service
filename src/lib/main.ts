import { spawn, SpawnOptions, exec } from 'child_process';
import { ConfigModel } from '../models/config-model';
import { Process } from '../models/process';
import { ProcessState } from '../models/process-state';
import { ProcessStatus } from '../models/process-status';

export class Main {
    private runningProcessess: Array<ProcessState>;
    constructor(runningProcessList: Array<ProcessState>) {
        console.log(`Starting Utility to run multiple micro services`);
        this.runningProcessess = runningProcessList;
    }

    run(config: ConfigModel) {

        const options: SpawnOptions = {
            shell: true,
            detached: true,
            // cwd: '../studentfinder.schoolbell.chat',
            timeout: 20000,
            stdio: ['ignore', 'ignore', 'ignore']
        };

        config.processess.forEach((process: Process) => {
            const command = spawn(process.command || config.defaultCommand, 
                process.arguments || config.defaultArguments || [], 
                process.options || config.defaultOptions || options);
            const processState: ProcessState = {
                processId: command.pid,
                name: process.name,
                status: ProcessStatus.RUNNING,
                process: command
            };
            this.runningProcessess.push(processState);
            command.unref();
        });
    }

    public start(name: string) {

    }

    public kill(pid: number) {
        this.loadProcess(pid).then((childProcess: ProcessState) => {
            if (childProcess.status === ProcessStatus.RUNNING) {
                childProcess.process.ref();
                if (process.platform === 'win32') {
                    // childProcess.process.kill('SIGINT');
                    // specific for windows as SIGINT does not seem to work
                    exec(`taskkill -F -T -PID ${pid}`, (error, stdout: string, stderr) => {
                        if(error) {
                            console.log(`Error: ${error}`);
                        }
                        console.log(`${stdout}`);
                        console.log(`${stderr}`);
                    });
                } else {
                    // not sure if this will work in linux
                    childProcess.process.kill('SIGHUP');
                }
                console.log(`Is process killed?: ${childProcess.process.killed}`);
                childProcess.status = ProcessStatus.CLOSED;
            } else {
                console.log(`Process ${pid} is not in running state.`)
            }
        }).catch(error => {
            console.error(error);
        });
    }

    public killAll() {
        this.runningProcessess.forEach((childProcess: ProcessState) => {
            this.kill(childProcess.processId);
        });
    }

    private loadProcess(pid: number): Promise<ProcessState> {
        let found = false;
        return new Promise<ProcessState>((resolve, reject) => {
            this.runningProcessess.forEach((state: ProcessState) => {
                if (state.processId === pid) {
                    found = true;
                    resolve(state);
                }
            });
            if (!found) {
                reject(`Process ${pid} not found`);
            }
        });
    }
}
