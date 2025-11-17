import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from '../routes/authRoute';
import userRouter from '../routes/userRoute';
dotenv.config();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log('[ database ] connected');
  } catch (error) {
    console.error('[ database ] connection error:', error);
    process.exit(1);
  }

  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    console.log(`[req] ${req.method} ${req.originalUrl}`);
    next();
  });


  // Routes
  app.use('/auth', router);
  app.use('/user', userRouter);

  // Health check
  app.get('/', (req, res) => res.send({ message: 'Hello API' }));


  // // Global error handler
  // app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //   console.error('Global error handler caught:', err);

  //   if (res.headersSent) {
  //     // Let Express handle response if already sent
  //     return next(err);
  //   }

  //   const statusCode = err.statusCode || 500;
  //   const message = err.message || 'Internal Server Error';

  //   res.status(statusCode).json({
  //     ok: false,
  //     error: {
  //       message,
  //       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  //     },
  //   });
  // });

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

startServer();
