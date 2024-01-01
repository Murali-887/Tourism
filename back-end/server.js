import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({path: './.env'});

const PORT = process.env.PORT || 4200;
const DB = process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connected successfully'));

const server = app.listen(PORT, err => {
    if(err) console.log(err.message);
    console.log(`Server is up and lising on ${PORT}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection 💥 Shutting down');
    server.close(() => process.exit(1));
});