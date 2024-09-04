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
import { Client } from 'pg';

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

const startServer = async () => {
    try {
        await init();
        setUpEmitter();
        https.createServer(sslOptions, app).listen(PORT, HOST, () => {
            console.log(`Server is listening on https://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error('Lỗi khi khởi tạo máy chủ:', error);
        process.exit(1); // Thoát để pm2 khởi động lại
    }
};

// Xử lý kết nối PostgreSQL
const checkPostgresConnection = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('PostgreSQL connected successfully!');
    } catch (error) {
        console.error('Lỗi kết nối PostgreSQL:', error);
        process.exit(1); // Thoát để pm2 khởi động lại
    } finally {
        await client.end();
    }
};

process.on('uncaughtException', (err) => {
    console.error('Ngoại lệ không được bắt:', err);
    process.exit(1); // Thoát để pm2 khởi động lại
});

process.on('unhandledRejection', (err) => {
    console.error('Từ chối không được xử lý:', err);
    process.exit(1); // Thoát để pm2 khởi động lại
});

// Kiểm tra kết nối PostgreSQL trước khi khởi động máy chủ
checkPostgresConnection().then(startServer);
