import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const entityActions: Array<ManifestTypes> = [
	{
		type: 'globalContext',
		alias: 'Umb.GlobalContext.AppLanguage',
		name: 'App Language Context',
		js: () => import('./app-language.context.js'),
	},
	{
		type: 'sectionSidebarApp',
		alias: 'Umb.SectionSidebarItem.LanguageSelect',
		name: 'App Language Select Section Sidebar Item',
		js: () => import('./app-language-select.element.js'),
		weight: 900,
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: 'Umb.Section.Content',
			},
		],
	},
];

export const manifests = [...entityActions];
