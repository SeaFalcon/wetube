import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// 연결을 끊을 수 있음 send쓰면..
const middleware = (req, res, next) => {
  res.send("not happening");
};

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(4000, () => console.log("Listening on http://localhost:4000..."));
