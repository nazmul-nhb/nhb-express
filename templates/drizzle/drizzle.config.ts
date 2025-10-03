import { defineConfig } from 'drizzle-kit';
import configs from './src/app/configs';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/drizzle/schema/*',
	out: './migrations',
	dbCredentials: {
		url: configs.databaseUrl,
	},
	migrations: {
		schema: 'public',
		prefix: 'timestamp',
	},
	introspect: {
		casing: 'preserve',
	},
	verbose: true,
	strict: true,
});
