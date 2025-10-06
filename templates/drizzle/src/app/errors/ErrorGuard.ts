import type { DrizzleErrorCause, IParserError } from '@/types/interfaces';
import { DrizzleError, DrizzleQueryError } from 'drizzle-orm';
import { isObjectWithKeys, isString } from 'nhb-toolbox';

class ErrorGuard {
	/** * Type guard to check if an error is an Express Body Parser Error. */
	isParserError(error: unknown): error is IParserError {
		return (
			isObjectWithKeys(error, ['type']) &&
			isString(error.type) &&
			error.type === 'entity.parse.failed'
		);
	}

	/** * Type guard to check if an error is either `DrizzleQueryError` or `DrizzleError` */
	isDrizzleError(error: unknown): error is DrizzleQueryError | DrizzleError {
		return error instanceof DrizzleQueryError || error instanceof DrizzleError;
	}

	/** * Type guard to check if `cause` property of `DrizzleQueryError` has certain properties */
	isDrizzleErrorCause(error: unknown): error is DrizzleErrorCause {
		return isObjectWithKeys(error, ['code', 'detail', 'table_name']);
	}
}

export const errorGuard = new ErrorGuard();
