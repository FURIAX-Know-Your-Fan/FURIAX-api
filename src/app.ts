import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connect_db } from "./db/connect_db";
import router from "./router/Router";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { trigger_retrive_user_tweets } from "./func/trigger_retrive_user_tweets";

const app = express();
const PORT = process.env.PORT || 3001;

// cron.schedule("* * * * *", () => {
//   console.log("Executando tarefa agendada a cada 5 minutos");
// });

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
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

connect_db();

// cron.schedule("* * * * *", async () => {
//   console.log("Executando tarefa agendada a cada 5 minutos");
//   await trigger_retrive_user_tweets();
// });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
