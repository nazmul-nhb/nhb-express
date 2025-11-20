import { PrismaClient } from '../../../generated/prisma';
import { Stylog } from 'nhb-toolbox/stylog';
import { PrismaPg } from '@prisma/adapter-pg';
import configs from '@/configs';

const pgAdapter = new PrismaPg({ connectionString: configs.databaseUrl });

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export const prisma = new PrismaClient({
	adapter: pgAdapter,
	errorFormat: 'colorless',
	log: [{ emit: 'event', level: 'error' }],
});

prisma.$on('error', (event) => {
	Stylog.ansi16('blue').log(event.message);
});

// ! Export everything from Prisma CLient
export * from '../../../generated/prisma/index';
