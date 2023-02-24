import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import { connect } from 'mongoose';
import postRouter from './mongodb/routes/post.js';
import dalleRouter from './dalle/dalle.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.send('Hello from DALL-E');
});

const startServer = async () => {

    try {

        connectDB(process.env.IMAGE_GENERATION_APP_MONGODB_URL);
        app.listen(8080, () => {
            console.log(`Server started at http://localhost:8080`);
        });
    } catch (error) {
        console.log(error)
    }
}

startServer();