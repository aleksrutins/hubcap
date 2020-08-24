#!/usr/bin/env node
import { Cli, Command } from 'clipanion';
import { InstallCommand } from './InstallCommand';
import { DependCommand } from './dependencies';


const cli = new Cli({
    binaryLabel: `Hubcap`,
    binaryName: `hubcap`,
    binaryVersion: `1.4`,
});

cli.register(InstallCommand);
cli.register(DependCommand);
cli.register(Command.Entries.Help);
cli.register(Command.Entries.Version);

cli.runExit(process.argv.slice(2), {
    ...Cli.defaultContext,
});