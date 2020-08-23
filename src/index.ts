#!/usr/bin/env node
import {Cli} from 'clipanion';
import * as yup from 'yup';
import {InstallCommand} from './InstallCommand'

const cli = new Cli({
    binaryLabel: `Hubcap`,
    binaryName: `hubcap`,
    binaryVersion: `1.0.0`,
});

cli.register(InstallCommand);

cli.runExit(process.argv.slice(2), {
    ...Cli.defaultContext,
});