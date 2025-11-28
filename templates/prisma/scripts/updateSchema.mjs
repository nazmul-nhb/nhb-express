// @ts-check

import { capitalizeString } from 'nhb-toolbox';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * * Generate model for Prisma by updating `prisma/schema.prisma` file.
 * @param {string} modelName Name of the model in singular form (exactly as module name).
 */
export function updatePrismaSchema(modelName) {
	const filePath = resolve('prisma/schema.prisma');
	const capModel = capitalizeString(modelName);

	const content = readFileSync(filePath, 'utf8');

	const newModel = `
model ${capModel} {
  id         Int      @id @default(autoincrement())
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt()
}
`;

	writeFileSync(filePath, content + newModel);
}
