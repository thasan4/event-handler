import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import auth from './middleware/auth.js';
import logger from './middleware/logger.js';
import eventRoutes from './routes/eventRoutes.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(bodyParser.json());

const mongoUri = process.env.MONGODB_URI;
if(!mongoUri) {
  throw new Error(
    `MongoURI was not supplied.`
  );
}

mongoose.connect('mongodb://root:root@localhost:27017/pics-io?authSource=admin');

app.use(auth);
app.use(logger);
app.use('/event', eventRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
