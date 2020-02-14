import { spawn, SpawnOptions, exec, ChildProcess } from 'child_process';
import { ConfigModel } from '../models/config-model';
import { Process } from '../models/process';
import { ProcessState } from '../models/process-state';
import { ProcessStatus } from '../models/process-status';

export class Main {
    private config: ConfigModel;
    private runningProcessList: Array<ProcessState> = new Array<ProcessState>();
    constructor(config: ConfigModel) {
        this.config = config;
    }

    run() {
        this.config.processess.forEach((process: Process) => {
            this.runProcess(process);
        });
    }

    private async runProcess(process: Process) {
        const options: SpawnOptions = {
            shell: true,
            detached: true,
            timeout: 20000,
            stdio: ['ignore', 'ignore', 'ignore']
        };

        const command = spawn(process.command || this.config.defaultCommand, 
            process.arguments || this.config.defaultArguments || [], 
            process.options || this.config.defaultOptions || options);
        const processState: ProcessState = {
            processId: command.pid,
            name: process.name,
            status: ProcessStatus.RUNNING,
            process: command
        };
        await this.loadRunningProcessByName(process.name).then((state: ProcessState) => {
            state.processId = command.pid;
            state.process = command;
            state.status = ProcessStatus.RUNNING;
        }).catch(error => {
            this.runningProcessList.push(processState);
        });
        command.unref();
    }

    public start(name: string) {
        this.loadRunningProcessByName(name).then((runningProcess: ProcessState) => {
            if(runningProcess.status !== ProcessStatus.RUNNING) {
                this.findProcessFromConfigFileByName(name).then((process: Process) => {
                    this.runProcess(process);
                }).catch(error => {
                    console.error(error);
                });
            } else {
                console.log(`${name} already running. Hence ignoring the command`);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    public startAll() {
        this.config.processess.forEach((process: Process) => {
            this.start(process.name);
        })
    }

    public kill(pid: number) {
        this.loadRunningProcess(pid).then((childProcess: ProcessState) => {
            if (childProcess.status === ProcessStatus.RUNNING) {
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
                    childProcess.process ? childProcess.process.ref() : null;
                    childProcess.process ? childProcess.process.kill('SIGHUP') : null;
                }
                childProcess.status = ProcessStatus.CLOSED;
            } else {
                console.log(`Process ${pid} is not in running state.`)
            }
        }).catch(error => {
            console.error(error);
        });
    }

    public killAll() {
        this.runningProcessList.forEach((childProcess: ProcessState) => {
            this.kill(childProcess.processId);
        });
    }

    private loadRunningProcess(pid: number): Promise<ProcessState> {
        let found = false;
        return new Promise<ProcessState>((resolve, reject) => {
            this.runningProcessList.forEach((state: ProcessState) => {
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

    private loadRunningProcessByName(name: string): Promise<ProcessState> {
         let found = false;
         return new Promise<ProcessState>((resolve, reject) => {
            this.runningProcessList.forEach((state: ProcessState) => {
                // console.log(`Loading process from memory`)
                if (state.name === name) {
                    found = true;
                    resolve(state);
                }
            });
            if (!found) {
                console.log(`Unable to find process ${name} in list. Loading from config file...`);
                this.findProcessFromConfigFileByName(name).then((value: Process) => {
                    // console.log(`Initiliasing process state`)
                    const processState: ProcessState = {
                        processId: 0,
                        name: value.name,
                        status: ProcessStatus.UNKNOWN
                    }
                    this.runningProcessList.push(processState);
                    found = true;
                    resolve(processState);
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }

    private findProcessFromConfigFileByName(name: string): Promise<Process> {
        let found = false;
        return new Promise<Process>((resolve, reject) => {
            this.config.processess.forEach((process: Process) => {
                if (process.name === name) {
                    found = true;
                    resolve(process);
                }
            });
            if (!found) {
                reject(`Unable to find process ${name} in Config File.`)
            }
        });
    }

    getRunningProcessess(): Array<ProcessState> {
        return this.runningProcessList;
    }

    public getProcessFromConfigFileByLikeName(name: string): Promise<Array<Process>> {
        return new Promise<Array<Process>>((resolve, reject) => {
            const returnArray: Array<Process> = new Array<Process>();
            this.config.processess.forEach((process: Process) => {
                if (process.name.match(name)) {
                    returnArray.push(process);
                }
            });
            resolve(returnArray);
        });
    }

    private filterConfigArray(element: Process, index: number, array: Process[]) {

    }
}
