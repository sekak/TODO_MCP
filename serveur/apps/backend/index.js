import express from "express";
import { startServer } from "./server.js";
import AuthRouter from "./routes/auth.route.js";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  
}))

app.use("/api/v1/auth", AuthRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

startServer(app);

export default app;
