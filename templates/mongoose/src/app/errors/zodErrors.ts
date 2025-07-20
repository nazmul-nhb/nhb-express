import { joinArrayElements } from 'nhb-toolbox';
import type { ZodError } from 'zod';
import type { IErrorResponse, IErrorSource } from '../types/interfaces';

/** * Processes Zod Validation Errors and returns a structured response. */
export const handleZodErrors = (error: ZodError, stack?: string): IErrorResponse => {
	const errorSource: IErrorSource[] = error.issues.map((zodIssue) => {
		const path = zodIssue.path.join('.');
		let message = zodIssue.message;

		switch (zodIssue.code) {
			// case 'invalid_type':
			// 	message = `Expected ${zodIssue.expected} for “${path}” but received “${zodIssue.input}”!`;
			// 	break;
			case 'invalid_value':
				message = `Invalid value for “${path}”. Expected one of: “${joinArrayElements(zodIssue.values)}”!`;
				break;
			// case ZodIssueCode.too_small:
			// 	message =
			// 		zodIssue.type === 'string' ?
			// 			`Value for “${path}” must contain at least ${zodIssue.minimum} character(s)`
			// 		:	`Value for “${path}” is too small. Minimum: ${zodIssue.minimum}!`;
			// 	break;
			// case ZodIssueCode.too_big:
			// 	message = `Value for “${path}” is too large. Maximum: ${zodIssue.maximum}!`;
			// 	break;
			// case ZodIssueCode.invalid_string:
			// 	message = `Invalid string format for “${path}”. Expected ${zodIssue.validation}!`;
			// 	break;
		}

		return { path, message };
	});

	return {
		statusCode: 400,
		name: 'Zod Validation Error',
		errorSource,
		stack: error.stack || stack,
	};
};
