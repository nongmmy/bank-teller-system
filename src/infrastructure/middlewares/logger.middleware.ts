import winston from 'winston';
import morgan from 'morgan';

const { combine, timestamp, json } = winston.format;

export const logger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    json()
  ),
  transports: [new winston.transports.Console()],
});

export const accessLogger = morgan(':method :url :status - :response-time ms', {
  stream: {
    // Configure Morgan to use our custom logger
    write: (message) => logger.http(message.trim()),
  },
});
