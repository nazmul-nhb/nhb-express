/** HTTP Status Code Mapping */
export const STATUS_CODES = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	CONFLICT: 409,
	UNSUPPORTED_MEDIA_TYPE: 415,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
} as const;

/** User Roles */
export const USER_ROLES = ['super_admin', 'admin', 'user'] as const;

/**Admin Roles */
export const ADMIN_ROLES = USER_ROLES.filter((role) => role !== 'user');

/** Collection Names */
export const COLLECTIONS = ['N/A', 'User'] as const;
