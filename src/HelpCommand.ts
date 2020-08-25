import { Command } from "clipanion";
import * as chalk from 'chalk';

export class HelpCommand extends Command {
    @Command.Path('help')
    async execute() {
        console.log(chalk
`{bold Hubcap}
{bold.green Usage:} $ {green hubcap} <{red command}> [{yellow options}]

{bold Commands:}
{green install} <{red repo}>
Installs a GitHub repository according to the instructions in the {bold .hubcap/config.yml} file in the repository.

{green depend}
Installs the dependencies defined in the {bold hubcap/config.yml} file in the current directory.

{green help}
Shows this help.`
);
    }
}