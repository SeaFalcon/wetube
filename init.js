import "./db";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import app from "./app";
import "./models/Video";
import "./models/Comment";
import "./models/User";

dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`Listeneing on: https://localhost:${PORT}`);

const options = {
  key: fs.readFileSync("private.pem"),
  cert: fs.readFileSync("public.pem")
};

// app.listen(PORT, handleListening);
https.createServer(options, app).listen(PORT, handleListening);
