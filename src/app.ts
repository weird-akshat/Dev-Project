import express from "express";
import templateRouter from "./routes/templateRoutes";

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect routes with /api prefix
app.use("/api", templateRouter);

export default app;
