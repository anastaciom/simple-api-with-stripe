import "dotenv/config";
import express from "express";
import { routes } from "./routes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3030;

app.use(cors({ origin: process.env.ORIGIN }));
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}...`);
});
