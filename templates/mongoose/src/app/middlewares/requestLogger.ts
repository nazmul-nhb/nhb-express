import configs from '@/configs';
import type { RequestHandler } from 'express';
import { Chronos, roundNumber } from 'nhb-toolbox';
import { Stylog } from 'nhb-toolbox/stylog';

/** * Logs incoming HTTP requests in a structured and readable format. */
export const requestLogger: RequestHandler = (req, res, next): void => {
	const now = new Chronos();

	const time =
		configs.NODE_ENV === 'development' ?
			now.format(`ddd, mmm DD, YYYY HH:mm:ss:mss [${now.getTimeZoneName()}]`)
		:	now.formatUTC('ddd, mmm DD, YYYY HH:mm:ss:mss [GMT]');

	const method = req.method;
	const url = req.originalUrl;
	const ip = req.ip ?? 'unknown';

	const start = process.hrtime.bigint();

	res.on('finish', () => {
		const end = process.hrtime.bigint();
		const durationMs = roundNumber(Number(end - start) / 1_000_000);

		const durationColor =
			durationMs > 1000 ? Stylog.error
			: durationMs > 500 ? Stylog.yellow
			: Stylog.teal;

		const statusColor =
			res.statusCode >= 500 ? Stylog.bgYellow.whitesmoke
			: res.statusCode >= 400 ? Stylog.bgError.whitesmoke
			: res.statusCode >= 300 ? Stylog.bgCyan.whitesmoke
			: Stylog.bgTeal.whitesmoke;

		console.info(
			`🕒 ${Stylog.yellow.string(time)}\n` +
				`📡 ${Stylog.cyan.bold.string(method)} ${Stylog.cyan.string(url)} → ` +
				`${statusColor.bold.string(` ${Stylog.white.string(res.statusCode ?? 500)} `)} ` +
				`🌍 IP: ${Stylog.gray.string(ip)} → ` +
				`⏱️ ${durationColor.string(durationMs + 'ms')}`
		);
	});

	next();
};
