import dotenv from "dotenv";
import { Client, ClientConfig } from "pg";

dotenv.config();

const pgClientConfig: ClientConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD
}

const pgClient = new Client(pgClientConfig);

export const pgConnect = async () => {
    try {
        await pgClient.connect();
        console.log("connected successfully!");
    } catch (error) {
        console.log(error);
    }
}

export default pgClient;