import dotenv from "dotenv";
import { Client, ClientConfig } from "pg";
import { createClient, RedisClientOptions, RedisClientType } from "redis";

dotenv.config();

const pgClientConfig: ClientConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD
}
export const pgClient = new Client(pgClientConfig);
export const pgConnect = async () => {
    try {
        await pgClient.connect();
        console.log("pg connected successfully!");
    } catch (error) {
        console.log(error);
    }
}


export const redisClient: RedisClientType = createClient({
    url: "redis://localhost:6379"
});
export const redisConnect = async () => {
    try {
        await redisClient.connect();
        console.log("redis connected successfully!");
    } catch (error) {
        console.log(error);
    }
}