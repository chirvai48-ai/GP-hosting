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
import applicationRouter from './routes/application.route'
import noteRouter from './routes/note.route'
import contactsRouter from './routes/contacts.route'
import { requireAuthUnlessNoAdmins } from './middlewares/requireAuth'

const app = express();


app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}))



// Sign-up open only to bootstrap the first admin, or to an already-authenticated
// admin thereafter — prevents public self-registration without a lockout on a fresh DB.
app.post("/api/auth/sign-up/email", requireAuthUnlessNoAdmins, toNodeHandler(auth));
app.all("/api/auth/*splat", toNodeHandler(auth));




app.use(express.json())
app.use(helmet());
app.use(compression());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/news",newsRouter);
app.use("/api/jobs",jobsRouter);
app.use("/api/applications",applicationRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api", noteRouter);
app.use(errorMiddleware);

app.get('/health', (req,res) => {
    res.send("App is running very healthy wow");
})

export default app