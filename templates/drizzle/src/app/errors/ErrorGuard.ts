import type { DrizzleErrorCause, IParserError } from '@/types/interfaces';
import { DrizzleError, DrizzleQueryError } from 'drizzle-orm';
import { isObject, isObjectWithKeys, isString } from 'nhb-toolbox';

class ErrorGuard {
	/** * Type guard to check if an error is an Express Body Parser Error. */
	isParserError(error: unknown): error is IParserError {
		return (
			isObject(error) &&
			'type' in error &&
			isString(error.type) &&
			error.type === 'entity.parse.failed'
		);
	}

	isDrizzleError(error: unknown): error is DrizzleQueryError | DrizzleError {
		return error instanceof DrizzleQueryError || error instanceof DrizzleError;
	}

	isDrizzleErrorCause(error: unknown): error is DrizzleErrorCause {
		return isObject(error) && isObjectWithKeys(error, ['code', 'detail', 'table_name']);
	}
}

export const errorGuard = new ErrorGuard();
