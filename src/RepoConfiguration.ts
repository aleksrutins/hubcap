import * as yup from 'yup';
import * as semver from 'semver';
export interface RepoConfiguration {
	name: string;
	version: string;
	scripts: {
		build: string[];
		preinstall: string[];
		install: string[];
		postinstall: string[];
	};
	sourceType: 'git' | 'tgz' | 'zip';
	source: string;
}

export const RepoConfigurationSchema = yup.object().shape({
	name: yup.string().required(),
	version: yup.string().required().test(
		'is-valid-semver',
		'${path} is not a valid Semantic Version',
		(ver: string | null | undefined) => (semver.valid(ver) == ver)
		),
	scripts: yup.object().required().shape({
		build: yup.array().ensure().of(yup.string()),
		preinstall: yup.array().ensure().of(yup.string()),
		install: yup.array().ensure().of(yup.string()),
		postinstall: yup.array().ensure().of(yup.string())
	}),
	sourceType: yup.string().required().matches(/^(git|tgz|zip)$/),
	source: yup.string().required()
});