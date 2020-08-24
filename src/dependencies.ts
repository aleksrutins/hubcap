import {Command} from 'clipanion';
import { RepoConfiguration } from "./RepoConfiguration";
import * as chalk from 'chalk';
import * as fs from 'fs';
export function installDependencies(ctx: Command, config: RepoConfiguration) {
    if(!config.depends) return;
    for(let dep of config.depends) {
        ctx.cli.run(['install', dep]);
    }
}

export class DependCommand extends Command {
    @Command.Path('depend', 'dep')
    async execute() {
        console.log(chalk`{bold.green Loading config...}`);
    }
}