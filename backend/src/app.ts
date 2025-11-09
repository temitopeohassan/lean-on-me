import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import reputationRouter from "./routes/reputation.js";
import loanRouter from "./routes/loans.js";
import dashboardRouter from "./routes/dashboard.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/reputation", reputationRouter);
app.use("/api/loans", loanRouter);
app.use("/api/dashboard", dashboardRouter);

export default app;


