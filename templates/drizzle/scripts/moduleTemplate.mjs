// @ts-check

import { capitalizeString, pluralizer } from 'nhb-toolbox';

/**
 * * Generate module for Drizzle/Postgres based Express TS Server.
 * @param {string} moduleName Name of the module.
 * @returns Array of objects (file names and contents).
 */
export function expressDrizzlePostgresTemplate(moduleName) {
	const capModule = capitalizeString(moduleName);
	const pluralModule = pluralizer.toPlural(moduleName);
	const pluralCapModule = pluralizer.toPlural(capModule);

	const baseAlias = '@';
	const moduleAlias = `@/modules/${moduleName}`;

	return [
		// ! module.route.ts
		{
			name: `${moduleName}.routes.ts`,
			content: `import validateRequest from '${baseAlias}/middlewares/validateRequest';
import { ${moduleName}Controllers } from '${moduleAlias}/${moduleName}.controllers';
import { ${moduleName}Validations } from '${moduleAlias}/${moduleName}.validation';
import { Router } from 'express';

const router = Router();

router.post(
	'/',
	validateRequest(${moduleName}Validations.creationSchema),
	${moduleName}Controllers.create${capModule},
);

router.get('/', ${moduleName}Controllers.getAll${pluralCapModule});

router.get('/:id', ${moduleName}Controllers.get${capModule}ById);

router.patch(
	'/:id',
	validateRequest(${moduleName}Validations.updateSchema),
	${moduleName}Controllers.update${capModule}ById,
);

router.delete('/:id', ${moduleName}Controllers.delete${capModule}ById);

export const ${moduleName}Routes = router;
            `,
		},
		// ! module.controllers.ts
		{
			name: `${moduleName}.controllers.ts`,
			content: `import { ${moduleName}Services } from '${moduleAlias}/${moduleName}.services';
import catchAsync from '${baseAlias}/utilities/catchAsync';
import sendResponse from '${baseAlias}/utilities/sendResponse';

class ${capModule}Controllers {
    /** * Create ${moduleName}. */
    create${capModule} = catchAsync(async (req, res) => {
        const ${moduleName} = await ${moduleName}Services.create${capModule}InDB(req.query);

        sendResponse(res, '${capModule}', 'POST', ${moduleName});
    });

	/** * Get all ${pluralModule} with optional queries. */
	getAll${pluralCapModule} = catchAsync(async (req, res) => {
		const ${pluralModule} = await ${moduleName}Services.getAll${pluralCapModule}FromDB(req.query);

		sendResponse(res, '${capModule}', 'GET', ${pluralModule});
	});

	/** * Get ${moduleName} by ${moduleName} id. */
	get${capModule}ById = catchAsync(async (req, res) => {
		const ${moduleName} = await ${moduleName}Services.get${capModule}ByIdFromDB(Number(req.params.id));

		sendResponse(res, '${capModule}', 'GET', ${moduleName});
	});

	/** * Delete ${moduleName} by id. */
	delete${capModule}ById = catchAsync(async (req, res) => {
		const result = await ${moduleName}Services.delete${capModule}ByIdFromDB(Number(req.params.id));

		sendResponse(res, '${capModule}', 'DELETE', result);
	});

	/** * Update ${moduleName} by id. */
	update${capModule}ById = catchAsync(async (req, res) => {
		const result = await ${moduleName}Services.update${capModule}InDB(Number(req.params.id), req.body);

		sendResponse(res, '${capModule}', 'PATCH', result);
	});
}

export const ${moduleName}Controllers = new ${capModule}Controllers();
            `,
		},
		// ! module.services.ts
		{
			name: `${moduleName}.services.ts`,
			content: `import { db } from '#/drizzle';
import { ${pluralModule} } from '#/drizzle/schema/${pluralModule}';
import { ErrorWithStatus } from '${baseAlias}/errors/ErrorWithStatus';
import type { Insert${capModule} } from '${moduleAlias}/${moduleName}.types';
import type { TQueries } from '${baseAlias}/types';
import { eq } from 'drizzle-orm';
import { isNotEmptyObject } from 'nhb-toolbox';
import { STATUS_CODES } from 'nhb-toolbox/constants';
            
class ${capModule}Services {
    /**
     * * Create new ${moduleName} in the DB.
     * @param payload All the required fields to create ${moduleName}.
     * @returns Created new ${moduleName}.
     */
    async create${capModule}InDB(payload: Insert${capModule}) {
        const [${moduleName}] = await db.insert(${pluralModule}).values(payload).returning();

		if (!${moduleName}) {
			throw new ErrorWithStatus(
				'Creation Error',
				'Cannot create ${moduleName} right now! Please try again later!',
				STATUS_CODES.INTERNAL_SERVER_ERROR,
				'CREATE /${moduleName}'
			);
		}

        return ${moduleName};
    }
    
    /**
     * * Get all ${pluralModule} from database.
     * @param query Optional query parameters to pass.
     * @returns All ${pluralModule} that matched the query as an array.
     */
    async getAll${pluralCapModule}FromDB(query?: TQueries<Insert${capModule}>) {
        console.log(query);

        return await db.select().from(${pluralModule}).orderBy(${pluralModule}.id);
    }
            
    /**
     * * Retrieve single ${moduleName} from DB.
     * @param id ID of ${moduleName} in integer form.
     * @returns The matched ${moduleName} against the provided id.
     */
    async get${capModule}ByIdFromDB(id: number) {
        const ${moduleName} = await db.query.${pluralModule}.findFirst({
            where: (ut, q) => q.eq(ut.id, id),
        });

        if (!${moduleName}) {
            throw new ErrorWithStatus(
                'Not Found Error',
                \`${capModule} not found with id \${id}!\`,
                STATUS_CODES.NOT_FOUND,
                'GET ${pluralModule}/:id'
            );
        }

        return ${moduleName};
    }

    /**
     * * Delete single ${moduleName} from DB.
     * @param id ID of the ${moduleName} to delete.
     * @returns Deleted ${moduleName}'s id as \`{ deleted_id: number }\`
     */
    async delete${capModule}ByIdFromDB(id: number) {
        const [res] = await db
            .delete(${pluralModule})
            .where(eq(${pluralModule}.id, id))
            .returning({ deleted_id: ${pluralModule}.id });

        if (!res) {
            throw new ErrorWithStatus(
                'Delete Error',
                \`Cannot delete ${moduleName} with id \${id}!\`,
                STATUS_CODES.NOT_FOUND,
                'DELETE ${pluralModule}/:id'
            );
        }

        return res;
    }

    /**
     * * Update ${moduleName} in DB by id.
     * @param id ID to find ${moduleName} from DB.
     * @param payload Fields to update in ${moduleName}.
     */
    async update${capModule}InDB(id: number, payload: Partial<Insert${capModule}>) {
        if (!isNotEmptyObject(payload)) {
            throw new ErrorWithStatus(
                'Empty Payload',
                \`Your payload is empty for ${moduleName} with id \${id}!\`,
                STATUS_CODES.BAD_REQUEST,
                'PATCH ${pluralModule}/:id'
            );
        }

        const [res] = await db.update(${pluralModule}).set(payload).where(eq(${pluralModule}.id, id)).returning();

        if (!res) {
            throw new ErrorWithStatus(
                'Update Error',
                \`Cannot update ${moduleName} with id \${id}!\`,
                STATUS_CODES.NOT_FOUND,
                'PATCH ${pluralModule}/:id'
            );
        }

        return res;
    }
}

export const ${moduleName}Services = new ${capModule}Services();
            `,
		},
		// ! module.validation.ts
		{
			name: `${moduleName}.validation.ts`,
			content: `import { ${pluralModule} } from '#/drizzle/schema/${pluralModule}';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const creationSchema = z
    .object({})
    .strict();

const updateSchema = creationSchema.partial();

/** Convert drizzle table schema to Zod schema */
const drizzleSchema = createInsertSchema(${pluralModule});

export const ${moduleName}Validations = { creationSchema, drizzleSchema, updateSchema };
            `,
		},
		// ! module.types.ts
		{
			name: `${moduleName}.types.ts`,
			content: `import type { ${pluralModule} } from '#/drizzle/schema/${pluralModule}';

export type Insert${capModule} = typeof ${pluralModule}.$inferInsert;

export type T${capModule} = typeof ${pluralModule}.$inferSelect;
            `,
		},
	];
}
