import * as chalk from 'chalk';
import * as shell from 'shelljs';
export default function runCommand(cmd: string, options: object = {}): number {
	console.log(chalk`{bold.green %} {underline.yellow ${cmd}}`);
	return shell.exec(cmd, options).code;
}
