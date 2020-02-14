import { ProcessStatus } from "./process-status";
import { ChildProcess } from "child_process";

export interface ProcessState {
    processId: number;
    name: string;
    status: ProcessStatus;
    process?: ChildProcess;
}