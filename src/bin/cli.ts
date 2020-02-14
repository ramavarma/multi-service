#!/usr/bin/env node
import { CommandLineHandler } from "../lib/command-line-handler";
import { CommandHandler } from "../lib/command-handler";

const commandLineHandler: CommandLineHandler = new CommandLineHandler(process.argv);
const commandHandler: CommandHandler = new CommandHandler();
commandLineHandler.process();
commandHandler.listenToCommand(commandLineHandler.getMain());


