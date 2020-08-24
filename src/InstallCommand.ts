import { Command } from 'clipanion';
import axios from 'axios';
import * as chalk from 'chalk';
import { RepoConfiguration, RepoConfigurationSchema, RepoConf, vars } from './RepoConfiguration';
import * as shell from 'shelljs';
import * as tar from 'tar';
import { Readable } from 'stream';
import runCommand from './runCommand';
import * as path from 'path';
import { installDependencies } from './dependencies';

export class InstallCommand extends Command {
	@Command.String({ required: true })
	public repo!: string;

	@Command.Path(`install`)
	async execute() {
		console.log(chalk`{bold.green Preparing directories...}`)
		shell.rm('-rf', '/usr/local/hubcap/tmp-unpack');
		shell.mkdir('-p', '/usr/local/hubcap/tmp-unpack');
		console.log(chalk`{bold.green Fetching manifest for GitHub repository {red ${this.repo}}...}`);
		let repoconf: RepoConfiguration;
		try {
			repoconf = RepoConf.parse((await axios.get(`https://raw.githubusercontent.com/${this.repo}/master/.hubcap/config.yml`)).data);
			RepoConfigurationSchema.validate(repoconf).catch(error => {
				console.log(chalk`{bold.red ${error.name}:}`);
				error.errors.forEach((err: string) => console.log(chalk`- {underline.red ${err}}`));
				shell.exit(1);
			});
		} catch (e) {
			console.log(chalk`{bold.red Error: {red ${e.toString()}}}`);
			return 1;
		}
		console.log(chalk`{bold.green Installing dependencies...}`);
		installDependencies(this, repoconf);
		console.log(chalk`{bold.green Downloading sources...\nType: {red ${repoconf.sourceType}}}`);
		switch (repoconf.sourceType) {
			case "tgz":
				console.log(chalk`{bold.green Downloading {red ${repoconf.source}}...}`);
				let srcstr = (await axios.get(repoconf.source)).data;
				console.log(chalk`{bold.green Unpacking...}`);
				shell.mkdir('/usr/local/hubcap/tmp-unpack');
				Readable.from([srcstr]).pipe(tar.x({
					C: '/usr/local/hubcap/tmp-unpack'
				}));
				break;
			case "zip":
				console.log(chalk`{bold.red Error: {red Reading from zip not implemented yet}}`);
				return 1;
			case "git":
				console.log(chalk`{bold.green Cloning {reset.red ${repoconf.source}}...}`);
				let res = runCommand(`git clone ${repoconf.source} /usr/local/hubcap/tmp-unpack`);
				if (res != 0) {
					console.log(chalk`{bold.red Error: {red Error running git}}`);
					return res;
				}
				break;
			default:
				console.log(chalk`{bold.red Error: {red sourceType must be one of: 'git', 'tgz', 'zip'}}`);
				return 1;
		}
		for (let script in repoconf.scripts) {
			console.log(chalk`{bold.green Running script} {red ${script}}{bold.green ...}`);
			let res = repoconf.runScript(script);
			if (res[0] != 0) {
				console.log(chalk`{bold.red Error ${res[0]}:} {red ${res[1]}}`);
				return res[0];
			}
		}
		console.log(chalk`{bold.green Creating symlinks...}`);
		let actVars = vars(this.repo);
		for (let binary in repoconf.bin) {
			console.log(chalk`{red /usr/bin/${binary}} {bold.green =>} {red ${path.join(actVars.PREFIX, repoconf.bin[binary])}}`);
			shell.ln('-sf', path.join(actVars.PREFIX, repoconf.bin[binary]), `/usr/bin/${binary}`);
		}
	}
}