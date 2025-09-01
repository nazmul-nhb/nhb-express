import configs from '@/configs';
import mongoose from 'mongoose';
import { Stylog } from 'nhb-toolbox/stylog';

/** * Connect to MongoDB using Mongoose. */
export const connectDB = async (): Promise<void> => {
	try {
		// Throw error if there is no connection string
		if (!configs.mongoUri) {
			throw new Error('MongoDB URI is Not Defined!');
		}

		await mongoose.connect(configs.mongoUri);

		console.info(Stylog.cyan.string('🔗 MongoDB is Connected!'));

		// Listen for established connection
		mongoose.connection.on('connected', () => {
			console.info(Stylog.cyan.string('🔗 MongoDB is Connected!'));
		});

		// Listen for connection errors
		mongoose.connection.on('error', (err) => {
			console.error(
				Stylog.error.string(`⛔ MongoDB Connection Error: ${err.message}`)
			);
		});

		// Optional: Listen for disconnection
		mongoose.connection.on('disconnected', () => {
			console.error(Stylog.error.string('⛔ MongoDB is Disconnected!'));
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(Stylog.error.string(`🚫 MongoDB Error: ${error.message}`));
		} else {
			console.error(Stylog.error.string('🛑 Unknown Error Occurred!'));
		}
	}
};
