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

app.use("/api", router);

const sslOptions = {
    key: fs.readFileSync(path.resolve(__dirname, 'keys/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'keys/server.crt')),
};

const startServer = () => {
    const server = https.createServer(sslOptions, app);

    server.listen(PORT, HOST, async () => {
        try {
            setUpEmitter();
            await init();
            console.log(`Server is listening on https://${HOST}:${PORT}`);
        } catch (error) {
            console.error('Lỗi khi khởi tạo máy chủ:', error);
            server.close(() => process.exit(1)); // Đóng máy chủ và thoát
        }
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
        console.error('Lỗi máy chủ:', err);
    });
};

startServer();

process.on('uncaughtException', (err: Error) => {
    console.error('Ngoại lệ không được bắt:', err);
    process.exit(1); // Thoát để `pm2` khởi động lại
});

process.on('unhandledRejection', (err: any) => {
    console.error('Từ chối không được xử lý:', err);
    process.exit(1); // Thoát để `pm2` khởi động lại
});

export default app;
