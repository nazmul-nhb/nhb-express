import dotenv from 'dotenv';
import type { LooseLiteral } from 'nhb-toolbox/utils/types';
import path from 'path';
import type { ms } from '../../index';

dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

export default {
	port: process.env.PORT || 4242,
	NODE_ENV: process.env.NODE_ENV as LooseLiteral<'development' | 'production'>,
	mongoUri: process.env.MONGO_URI as string,
	saltRounds: Number(process.env.SALT_ROUNDS),
	accessSecret: process.env.JWT_ACCESS_SECRET as string,
	accessExpireTime: process.env.JWT_ACCESS_EXPIRES_IN as ms.StringValue,
	refreshSecret: process.env.JWT_REFRESH_SECRET as string,
	refreshExpireTime: process.env.JWT_REFRESH_EXPIRES_IN as ms.StringValue,
	cloudName: process.env.CLOUD_NAME as string,
	cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
	cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
	imageBaseUrl: process.env.CLOUDINARY_IMAGE_BASE_URL as string,
};
