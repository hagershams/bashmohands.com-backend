// Modules Imports
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

// SEC Local Impports
// Router Imports
import adminRouter from '../src/modules/Admin/adminRouter.js';
import userRouter from '../src/modules//User/userRouter.js';
import authRouter from '../middlewares/auth/authRouter.js';

// Controllers Imports
import globalErrorHandler from '../middlewares/error/errorController.js';

// Utils Imports
import AppError from '../middlewares/error/appError.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CORS Handller

app.use(
  cors({
    origin: '*', // Replace with your frontend's actual origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to allow cookies to be sent with the request
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Logging Request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routers
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
// Not Found Router
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
