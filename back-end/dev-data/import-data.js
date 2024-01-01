import mongoose from 'mongoose';
import dotenv from 'dotenv'
import fs from 'fs';

import Tour from '../models/tourModel.js';
dotenv.config({path: '../.env'})

const DB = process.env.DATABASE_URI.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );

  mongoose.connect(DB, {}).then(() => console.log('DB connected successfully'));

const tours = JSON.parse(fs.readFileSync(`./tours.json`, 'utf8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log(`Data successfully loaded into database`);
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log(`Data deleted successfully`);
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] == '--i') importData();
if(process.argv[2] == '--d') deleteData();