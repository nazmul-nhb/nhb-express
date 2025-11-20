import type { COLLECTIONS, USER_ROLES } from '@/constants';
import type { STATUS_CODES } from 'nhb-toolbox/constants';
import type { GenericObject } from 'nhb-toolbox/object/types';
import type { Branded } from 'nhb-toolbox/types';
import type { LooseLiteral } from 'nhb-toolbox/utils/types';

export type ExceptionSignal = NodeJS.UncaughtExceptionOrigin | NodeJS.Signals;

export type TCollection = (typeof COLLECTIONS)[number];

export type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'OK';

export type TResponseDetails = { message: string; statusCode: number };

export type TStatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

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

// ! Prisma Error Type

export type PrismaErrorCodes = LooseLiteral<
	| 'P1000'
	| 'P1001'
	| 'P1002'
	| 'P1003'
	| 'P1008'
	| 'P1009'
	| 'P1010'
	| 'P1011'
	| 'P1012'
	| 'P1013'
	| 'P1014'
	| 'P1015'
	| 'P1016'
	| 'P1017'
	| 'P2000'
	| 'P2001'
	| 'P2002'
	| 'P2003'
	| 'P2004'
	| 'P2005'
	| 'P2006'
	| 'P2007'
	| 'P2008'
	| 'P2009'
	| 'P2010'
	| 'P2011'
	| 'P2012'
	| 'P2013'
	| 'P2014'
	| 'P2015'
	| 'P2016'
	| 'P2017'
	| 'P2018'
	| 'P2019'
	| 'P2020'
	| 'P2021'
	| 'P2022'
	| 'P2023'
	| 'P2024'
	| 'P2025'
	| 'P2026'
	| 'P2027'
	| 'P2028'
	| 'P2029'
	| 'P2030'
	| 'P2031'
	| 'P2033'
	| 'P2034'
	| 'P2035'
	| 'P2036'
	| 'P2037'
	| 'P3000'
	| 'P3001'
	| 'P3002'
	| 'P3003'
	| 'P3004'
	| 'P3005'
	| 'P3006'
	| 'P3007'
	| 'P3008'
	| 'P3009'
	| 'P3010'
	| 'P3011'
	| 'P3012'
	| 'P3013'
	| 'P3014'
	| 'P3015'
	| 'P3016'
	| 'P3017'
	| 'P3018'
	| 'P3019'
	| 'P3020'
	| 'P3021'
	| 'P3022'
	| 'P3023'
	| 'P3024'
	| 'P4000'
	| 'P4001'
	| 'P4002'
	| 'P6000'
	| 'P6001'
	| 'P6002'
	| 'P6003'
	| 'P6004'
	| 'P6005'
	| 'P6006'
	| 'P6008'
	| 'P6009'
	| 'P6010'
	| 'P5011'
>;
