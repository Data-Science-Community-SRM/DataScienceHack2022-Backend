import express from "express";
import config from 'config';
import connect from "./DB/connect";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";
import Logger from "../core/Logger";
import morgan from "morgan";
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100, 
	standardHeaders: true, 
	legacyHeaders: false,
})

process.on("uncaughtException", (e) => {
  Logger.error(e);
});

const port = config.get<number>("port");
const host = config.get<string>("host");

const app = express();

app.use(express.json());
app.use(deserializeUser);
app.use(limiter);
app.use(
  morgan(function (tokens: any, req: any, res: any) {
    const msg = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
    Logger.http(msg);
    return null;
    // return msg;
  })
);

app.listen(port,host, () => {
    Logger.info(`Server listening at http://${host}:${port}`);
    connect();
    routes(app);
})