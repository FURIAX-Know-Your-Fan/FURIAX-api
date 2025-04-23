import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connect_db } from "./db/connect_db";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("FURIAX API");
});
app.use(helmet());
const allowed_origins = process.env.ALLOWED_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowed_origins?.includes(origin)) {
        callback(null, true); // Permite a origem
      } else {
        callback(new Error("CORS não permitido"), false); // Bloqueia a origem
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect_db();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
