import type { TStatusCode } from '@/types';
import type { IErrorResponse, PrismaError } from '@/types/interfaces';
import { HTTP_STATUS } from 'nhb-toolbox/constants';

export function handlePrismaError(error: PrismaError): IErrorResponse {
	let name = error.name,
		message = 'Database Error! Please try again later!',
		path = 'unknown',
		statusCode: TStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

	const { modelName = '', driverAdapterError: target = {} } = error?.meta ?? {};

	const targetPath = target?.cause?.constraint?.fields.join('.') ?? 'unknown';

	switch (error.code) {
		case 'P2002':
			path = targetPath;
			statusCode = HTTP_STATUS.BAD_REQUEST;
			name = 'Database Error';
			message = `${modelName} already exists with the provided ${targetPath}!`;
			break;

		default:
			break;
	}

	return {
		name,
		statusCode,
		errorSource: [{ path, message }],
		stack: error.stack,
	};
}
