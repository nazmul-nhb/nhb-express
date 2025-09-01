import configs from '@/configs';
import { connectDB } from '@/configs/db';
import type { Server } from 'http';
import { Stylog } from 'nhb-toolbox/stylog';
import app from './app';

let server: Server;

const bootStrap = async () => {
	try {
		// Connect to DB
		await connectDB();

		// Listen to the Server
		server = app.listen(configs.port, () => {
			console.info(
				Stylog.yellow.string(`👂 Server is Listening on Port: ${configs.port}`)
			);
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(Stylog.error.string(`🚫 Error Occurred: ${error.message}`));
		} else {
			console.error(Stylog.error.string('🛑 Unknown Error Occurred!'));
		}
	}
};

bootStrap().catch(console.dir);

process.on('unhandledRejection', () => {
	console.error(
		Stylog.error.string(
			`🚫 Unhandled Rejection Detected!\n🛑 Server is Shutting Down...`
		)
	);

	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	process.exit(1);
});

process.on('uncaughtException', () => {
	console.error(
		Stylog.error.string(
			`🚫 Uncaught Exception Detected!\n🛑 Server is Shutting Down...`
		)
	);

	process.exit(1);
});

export default app;
