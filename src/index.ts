#!/usr/bin/env node
import { Cli } from 'clipanion';
import { InstallCommand } from './InstallCommand'

const cli = new Cli({
    binaryLabel: `Hubcap`,
    binaryName: `hubcap`,
    binaryVersion: `1.3`,
});

cli.register(InstallCommand);

cli.runExit(process.argv.slice(2), {
    ...Cli.defaultContext,
});