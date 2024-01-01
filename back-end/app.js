import express from 'express';
import cors from 'cors'
import tourRouter from './routes/tourRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

app.use('*', function(req, res) {
    res.status(404).json({
        status: 'error',
        message : `There is no route with this ${req.originalUrl}`,
    })
})

export default app;