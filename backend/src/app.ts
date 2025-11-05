import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import reputationRouter from "./routes/reputation.js";
import loanRouter from "./routes/loans.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/reputation", reputationRouter);
app.use("/api/loans", loanRouter);

export default app;


