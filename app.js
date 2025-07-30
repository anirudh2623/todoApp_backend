import express from 'express';
import userRouter from './routes/user.js'
import taskRouter from './routes/task.js'
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error.js';
import cors from 'cors';

config({
    path: './data/config.env'
})

const app = express();

// Using Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : [process.env.FRONTEND_URL],
    methods : ['GET', 'PUT', 'POST', 'DELETE'],
    credentials : true
}))

// Using routes
app.use('/api/v1/users',userRouter);
app.use('/api/v1/task', taskRouter);

app.get('/', (req, res)=>{
    res.send('Hello World!')
})

// Error Middleware
app.use(errorMiddleware)

export default app;