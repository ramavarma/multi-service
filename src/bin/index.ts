#!/usr/bin/env node
import { CommandLineHandler } from "../lib/command-line-handler";
import { CommandHandler } from "../lib/command-handler";
import { ProcessState } from "../models/process-state";

const runningProcessess: Array<ProcessState> = new Array<ProcessState>();
const commandLineHandler: CommandLineHandler = new CommandLineHandler(process.argv, runningProcessess);
const commandHandler: CommandHandler = new CommandHandler(runningProcessess);
commandLineHandler.process();
commandHandler.listenToCommand();


