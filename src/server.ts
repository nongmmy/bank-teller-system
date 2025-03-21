import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import transactionRoutes from './infrastructure/routes/transaction.route';
import authRoutes from './infrastructure/routes/auth.route';
import accountRoutes from './infrastructure/routes/account.route';
import { myDataSource } from './infrastructure/config/typeorm.config';
import { accessLogger } from './infrastructure/middlewares/logger.middleware';
import { errorHandler } from './infrastructure/middlewares/error.middleware';

dotenv.config();

export const app = express();

app.use(accessLogger);
app.use(express.json());

// health check
app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
});

app.use('/', transactionRoutes);
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);

// Global error handler (last middleware)
app.use(errorHandler);

myDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
