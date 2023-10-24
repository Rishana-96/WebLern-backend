import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import { createServer } from 'http';
const http = createServer(app)
import userRoute from './routes/userRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import tutorRoute from './routes/tutorRoutes.js';


dotenv.config();
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}))
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.use('/files',express.static('Files'));
app.use('/',userRoute);
app.use('/admin',adminRoute);
app.use('/tutor',tutorRoute)


mongoose.connect(process.env.MONGO,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('database connected successfully');
});

const server = http.listen(process.env.PORT,()=>{
    console.log('Server started listening to port');
});
