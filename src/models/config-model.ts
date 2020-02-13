import { Process } from "./process";
import { SpawnOptions } from "child_process";

export interface ConfigModel {
    defaultCommand: string;
    defaultArguments?: Array<string>;
    processess: Array<Process>;
    defaultOptions: SpawnOptions;
}