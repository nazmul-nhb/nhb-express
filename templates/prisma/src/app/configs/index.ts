import dotenv from 'dotenv';
import type { StringValue } from 'ms';
import type { LooseLiteral } from 'nhb-toolbox/utils/types';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

export default {
	/** * Environment name, e.g. `development`, `production` etc. */
	NODE_ENV: process.env.NODE_ENV as LooseLiteral<'development' | 'production'>,
	/** * Port number on which the server runs. Defaults to `4242` if not specified. */
	port: process.env.PORT || (4242 as const),
	/** * Number of salt rounds for hashing passwords. */
	saltRounds: Number(process.env.SALT_ROUNDS),
	/** * JWT Access Token secret. */
	accessSecret: process.env.JWT_ACCESS_SECRET as string,
	/** * JWT Access expiry time. */
	accessExpireTime: process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
	/** * JWT Refresh Token secret. */
	refreshSecret: process.env.JWT_REFRESH_SECRET as string,
	/** * JWT Refresh Token expiry time. */
	refreshExpireTime: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
	/**
	 * * Cloudinary cloud name.
	 * @see {@link https://cloudinary.com/documentation/image_upload_api_reference#overview Cloudinary Documentation}
	 */
	cloudName: process.env.CLOUD_NAME as string,
	/**
	 * * Cloudinary API Key.
	 * @see {@link https://cloudinary.com/documentation/node_integration Cloudinary Documentation}
	 */
	cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
	/**
	 * * Cloudinary API Secret.
	 * @see {@link https://cloudinary.com/documentation/node_integration Cloudinary Documentation}
	 */
	cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
	/**
	 * * Cloudinary image base URL for constructing image URLs.
	 * @example `https://res.cloudinary.com/<your_cloud_name>/image/upload/`
	 */
	cloudinaryImageBaseUrl: process.env.CLOUDINARY_IMAGE_BASE_URL as string,
	/**
	 * * Email (gmail) to send emails from. It is for nodemailer `from` field.
	 * @see {@link https://nodemailer.com/usage/using-gmail#apppassword-requires-2step-verification/ Nodemailer Documentation}
	 */
	email: process.env.EMAIL as string,
	/**
	 * * App Password for the email (gmail) to send emails from. It is for nodemailer authentication.
	 * @see {@link https://nodemailer.com/usage/using-gmail#apppassword-requires-2step-verification/ Nodemailer Documentation}
	 */
	emailPassword: process.env.EMAIL_PASSWORD as string,
	/** * Client URL for password reset link for `auth` module. */
	resetPasswordLink: process.env.PASSWORD_RESET_LINK as string,
	/** * Database connection URL for Prisma ORM. */
	databaseUrl: process.env.DATABASE_URL as string,
};
