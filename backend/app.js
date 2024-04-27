import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

// Configure the .env files.
dotenv.config({ path: ".env" });

import {
    errorHandlerMiddleware,
    handleUncaughtError
} from "./middleware/errorHandlerMiddleware.js"

import userRoutes from "./src/user/routes/user.routes.js"

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configuring routes.
app.use("/api/user", userRoutes);

// Default path.
app.get("/", (req, res) => {
    res.status(200).send("Welcome to our login server.");
})

// errorHandlerMiddleware
app.use(errorHandlerMiddleware);

// 404 API handler
app.use((req, res) => {
    console.log(handleUncaughtError());
    res.status(503).send("You are in invalid API route");
});

export default app;