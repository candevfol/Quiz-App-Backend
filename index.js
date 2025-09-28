import { configDotenv } from 'dotenv';
configDotenv({});

import express from 'express';
import quizRouter from './router/quiz_router.js';
import questionRouter from './router/question_router.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>res.send(`App is working fine`))

app.use('/api/quiz', quizRouter);
app.use('/api/question', questionRouter);

app.use((err, req, res, next)=> {
    console.log(err);
    res.status(500).json({success: false, message: err.message})
})

app.listen(PORT, ()=> {
    console.log(`App is listning to port number: ${PORT}`);
})