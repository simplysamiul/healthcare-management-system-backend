/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
import { indexRoute } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";


const app: Application = express();


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// route
app.use("/api/v1", indexRoute);


// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('HealthCare API is running!');
});


// handle error globally
app.use(globalErrorHandler);

// handle not found route
app.use(notFound);


export default app;