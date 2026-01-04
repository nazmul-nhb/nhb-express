import configs from '@/configs';
import type { ExceptionSignal } from '@/types';
import { createServer, type Server } from 'node:http';
import { convertStringCase } from 'nhb-toolbox';
import { Stylog } from 'nhb-toolbox/stylog';
import { networkInterfaces } from 'node:os';
import app from './app';

let server: Server;

const bootStrap = async () => {
	try {
		// Create server with Node.js so that it can later be integrated with socket(s)
		server = createServer(app);

		const ip = getNetworkIP();

		// Listen to the Server
		server.listen(configs.port, '0.0.0.0', () => {
			console.info(
				Stylog.yellow.toANSI(`👂 Server is Listening on Port: ${configs.port}\n`) +
					Stylog.bold.toANSI('🌍 Access from Local: ') +
					Stylog.royalblue.bold.toANSI(`http://localhost:${configs.port}`) +
					(ip ?
						Stylog.bold.toANSI('\n🌍 Access from Network: ') +
						Stylog.royalblue.bold.toANSI(`http://${ip}:${configs.port}`)
					:	'')
			);
		});

		// Handle Exceptions & System Signals
		handleException('SIGTERM');
		handleException('SIGINT');
		handleException('uncaughtException');
		handleException('unhandledRejection');
	} catch (error) {
		if (error instanceof Error) {
			console.error(Stylog.error.toANSI(`🚫 Error Occurred: ${error.message}`));
		} else {
			console.error(Stylog.error.toANSI('🛑 Unknown Error Occurred!'));
		}
	}
};

/**
 * * Monitor system signals and exceptions and shutdown the server gracefully with logs.
 * @param event Exception or signal event to monitor.
 */
function handleException(event: ExceptionSignal) {
	process.on(event, () => {
		const exception =
			event?.startsWith('un') ? convertStringCase(event, 'Title Case') : event;

		console.error(
			Stylog.error.toANSI(`🚫 ${exception} Detected!\n🛑 Server is Shutting Down...`)
		);

		if (server) {
			server.close(() => {
				process.exit(0);
			});
		} else {
			process.exit(0);
		}
	});
}

/** * Get LAN `IPv4` address */
function getNetworkIP(): string | undefined {
	const nets = networkInterfaces();

	for (const name of Object.keys(nets)) {
		for (const net of nets[name] ?? []) {
			if (net.family === 'IPv4' && !net.internal) {
				return net.address;
			}
		}
	}
}

bootStrap().catch(console.dir);
