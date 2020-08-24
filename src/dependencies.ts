import {Command} from 'clipanion';
import { RepoConfiguration, RepoConf } from "./RepoConfiguration";
import * as chalk from 'chalk';
import * as fs from 'fs';
export function installDependencies(ctx: Command, config: RepoConfiguration) {
    if(!config.depends) return;
    for(let dep of config.depends) {
        ctx.cli.run(['install', dep]);
    }
}

export class DependCommand extends Command {
    @Command.Path('depend')
    async execute() {
        console.log(chalk`{bold.green Loading config...}`);
        const conf = RepoConf.parse(fs.readFileSync('.hubcap/config.yml').toString());
        console.log(chalk`{bold.green Installing dependencies...}`);
        installDependencies(this, conf);
    }
}