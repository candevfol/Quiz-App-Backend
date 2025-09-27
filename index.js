import { configDotenv } from 'dotenv';
configDotenv({});

import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>res.send(`App is working fine`))

app.listen(PORT, ()=> {
    console.log(`App is listning to port number: ${PORT}`);
})