import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import https from "https";
import router from "./routers";
import init from "./config/init";
import fs from "fs";
import { setUpEmitter } from "./config/emit";

dotenv.config();

const app = express();
const PORT = Number(process.env.APP_PORT);
const HOST = `${process.env.APP_HOST}`;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get("/", (req, res) => { res.json({ mess: "done" }) });
app.use("/api", router);

const sslOptions = {
    key: fs.readFileSync(path.resolve(__dirname, 'keys/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'keys/server.crt')),
};

https.createServer(sslOptions, app).listen(PORT, HOST, async () => {
    await init();
    setUpEmitter();
    console.log(`Server is listening on https://${HOST}:${PORT}`);
});

export default app;