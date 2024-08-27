import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import router from "./routers";
import init from "./config/init";
import { setUpEmitter } from "./config/emit";

dotenv.config();

const app = express();
const PORT = Number(process.env.APP_PORT);
const HOST = `${process.env.APP_HOST}`;

app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'))


app.use(router);

app.listen(PORT, HOST,async () => {
    try {
        setUpEmitter();
        // await init();
        console.log(`Server is listening on http://${HOST}:${PORT}`);
    } catch (error) {
        console.log(error);
    }
});

export default app;