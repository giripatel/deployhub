import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { deployRouter } from './routes/deploy'

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/api/v1",deployRouter);

app.listen(3000);
