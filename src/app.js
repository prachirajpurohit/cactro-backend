import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// import routes
import authRouter from "./routes/auth.route.js";
import eventRouter from "./routes/events.routes.js";

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", eventRouter);

export default app;