import express from 'express';
import { ENV } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { inngest, functions } from "../config/inngest.js";
import { serve } from "inngest/express";



const app = express();
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));


app.get('/', (req, res) => {
  res.send('Hello World!');
});
console.log("mongo-uri:", ENV.MONGO_URI);
const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== 'development') { 
      app.listen(ENV.PORT, () => {
      console.log('Server is running on port :', ENV.PORT);
      connectDB();
    });
    }
    
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};
startServer();
export default app;
