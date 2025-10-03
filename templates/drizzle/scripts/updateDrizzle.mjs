// @ts-check

import { readFileSync, writeFileSync } from 'fs';
import { pluralizer } from 'nhb-toolbox';
import { resolve } from 'path';

/**
 * Use comma for stringified contents if it does not end with a comma.
 * @param {string} content Contents to apply comma on.
 * @returns Proper content with/without comma.
 */
export function useComma(content) {
	const updated = content?.trimEnd();

	return updated?.endsWith(',') ? updated : `${updated},`;
}

/**
 * * Inject new schema in drizzle instance in `src/drizzle/index.ts`.
 * @param {string} schemaName Name of the schema in singular form
 */
export function updateDrizzleInstance(schemaName) {
	const filePath = resolve('src/drizzle/index.ts');
	let content = readFileSync(filePath, 'utf8');

	const schemaPlural = pluralizer.toPlural(schemaName);

	// Add new import line
	if (!content.includes(`import { ${schemaPlural} }`)) {
		content =
			`import { ${schemaPlural} } from '#/drizzle/schema/${schemaPlural}';\n` + content;
	}

	// Inject into the drizzle instance
	content = content.replace(
		/schema:\s*\{([\s\S]*?)\}/,
		(_, inner) => `schema: { ${useComma(inner)} ${schemaPlural} }`
	);

	writeFileSync(filePath, content);
}
