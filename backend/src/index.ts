require('dotenv').config()
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorMiddleware } from './middlewares/errorMiddleware';
import jobsRouter from './routes/jobs.route';
import swaggerSpec from './configs/swagger';
import swaggerUi from "swagger-ui-express";
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import {newsRouter} from './routes/news.route'

const app = express();


app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,  
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],         
}))



app.all("/api/auth/*splat", toNodeHandler(auth));




app.use(express.json())
app.use(helmet());
app.use(compression());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/news",newsRouter);
app.use("/api/jobs",jobsRouter);
app.use(errorMiddleware);

app.get('/health', (req,res) => {
    res.send("App is running very healthy wow");
})

export default app