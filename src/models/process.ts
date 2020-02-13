import { SpawnOptions } from "child_process";

export interface Process {
    name: string;
    command?: string;
    arguments?: Array<string>;
    options? : SpawnOptions;
}