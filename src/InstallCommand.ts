import {Command} from 'clipanion';
import * as YAML from 'yaml';
import axios from 'axios';
import * as chalk from 'chalk';
import {RepoConfiguration, RepoConfigurationSchema} from './RepoConfiguration';
import * as shell from 'shelljs';
import * as tar from 'tar';
import * as fs from 'fs';
import {Readable} from 'stream';

export class InstallCommand extends Command {
	@Command.String({required: true})
	public repo!: string;

	@Command.Path(`install`)
	async execute() {
		console.log(chalk`{bold.green Fetching manifest for GitHub repository {red ${this.repo}}...}`);
		let repoconf: RepoConfiguration;
		try {
			repoconf = YAML.parse((await axios.get(`https://raw.githubusercontent.com/${this.repo}/master/.hubcap/config.yml`)).data);
		} catch(e) {
			console.log(chalk`{bold.red Error: {red ${e.toString()}}}`);
			return 1;
		}
		console.log(chalk`{bold.green Downloading sources...\nType: {red ${repoconf.sourceType}}}`);
		switch(repoconf.sourceType) {
			case "tgz":
				console.log(chalk`{bold.green Downloading {red ${repoconf.source}}...}`);
				let srcstr = (await axios.get(repoconf.source)).data;
				console.log(chalk`{bold.green Unpacking...}`);
				shell.mkdir('~/.hubcap-tmp-unpack');
				Readable.from([srcstr]).pipe(tar.x({
					C: '~/.hubcap-tmp-unpack'
				}));
				break;
			case "zip":
				console.log(chalk`{bold.red Error: {red Reading from zip not implemented yet}}`);
				return 1;
			case "git":
				console.log(chalk`{bold.green Cloning {reset.red ${repoconf.source}}...}`);
				let res = shell.exec(`git clone ${repoconf.source} ~/.hubcap-tmp-unpack`);
				if(res != 0) {
					console.log(chalk`{bold.red Error: {red Error running git}}`);
					return res;
				}
				break;
			default:
				console.log(chalk`{bold.red Error: {red sourceType must be one of: 'git', 'tgz', 'zip'}}`);
				return 1;
		}
		console.log(chalk`{bold.green Running script {red build}...}`);
		
	}
}