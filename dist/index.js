"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const https_1 = __importDefault(require("https"));
const routers_1 = __importDefault(require("./routers"));
const init_1 = __importDefault(require("./config/init"));
const fs_1 = __importDefault(require("fs"));
const emit_1 = require("./config/emit");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.APP_PORT);
const HOST = `${process.env.APP_HOST}`;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express_1.default.static(path_1.default.join(__dirname, '../')));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('combined'));
app.use("/api", routers_1.default);
console.log(__dirname);
const sslOptions = {
    key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'keys/server.key')),
    cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'keys/server.crt')),
};
https_1.default.createServer(sslOptions, app).listen(PORT, HOST, async () => {
    try {
        (0, emit_1.setUpEmitter)();
        await (0, init_1.default)();
        console.log(`Server is listening on https://${HOST}:${PORT}`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = app;
