import type { COLLECTIONS, USER_ROLES } from '@/constants';
import type { HttpStatusCode, StatusCode } from 'nhb-toolbox/http-status/types';
import type { GenericObject } from 'nhb-toolbox/object/types';
import type { Branded } from 'nhb-toolbox/types';

export type ExceptionSignal = NodeJS.UncaughtExceptionOrigin | NodeJS.Signals;

export type TCollection = (typeof COLLECTIONS)[number];

export type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'OK';

export type TResponseDetails = { message: string; statusCode: StatusCode };

export type TStatusCode = HttpStatusCode<'clientError' | 'serverError'>;

export type TUserRole = (typeof USER_ROLES)[number];

export type TEmail = Branded<string, 'email'>;

export type TQueries<T extends GenericObject> = {
	[K in keyof T]?: T[K] extends string | boolean ? T[K] : string;
};

// ! May not need
export type SearchField<T> = {
	[K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

export type NumericKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];
