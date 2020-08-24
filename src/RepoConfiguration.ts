import * as yup from 'yup';
import * as YAML from 'yaml';
import runCommand from './runCommand';
export type ScriptResult = [number, string];
export const vars = (repoName: string) => ({
	PREFIX: `/usr/local/hubcap/install/${repoName}`
});
export namespace RepoConf {
	export function parse(stuff: string): RepoConfiguration {
		let conf: RepoConfiguration = YAML.parse(stuff);
		conf.runScript = script => {
			if (!conf.scripts[script]) return [1, "No such script"];
			for (let cmd of conf.scripts[script]) {
				for (let vari in vars(conf.name)) {
					cmd = cmd.replace(`\$(${vari})`, vars(conf.name)[vari]);
				}
				let res = runCommand(cmd, { cwd: '/usr/local/hubcap/tmp-unpack' });
				if (res != 0) {
					return [res, "Error in command"];
				};
			}
			return [0, "Completed successfully"];
		}
		return conf;
	}
}

export interface RepoConfiguration {
	name: string;
	scripts: {
		build: string[];
		preinstall: string[];
		install: string[];
		postinstall: string[];
		[scriptName: string]: string[] | null | undefined;
	};
	sourceType: 'git' | 'tgz' | 'zip';
	source: string;
	bin: {
		[binName: string]: string;
	};
	depends: string[];
	runScript(scriptName: string): ScriptResult;
}

export const RepoConfigurationSchema = yup.object().shape({
	name: yup.string().required(),
	scripts: yup.object().required().shape({
		build: yup.array().ensure().of(yup.string()),
		preinstall: yup.array().ensure().of(yup.string()),
		install: yup.array().ensure().of(yup.string()),
		postinstall: yup.array().ensure().of(yup.string())
	}),
	bin: yup.object(),
	depends: yup.array().ensure().of(yup.string()),
	sourceType: yup.string().required().matches(/^(git|tgz|zip)$/),
	source: yup.string().required()
});