import { RedisClientType } from "redis";
import HttpUtils from "../utils/http";
import { Request, Response } from "express";
import { redisClient } from "../config/connect";

export class AuthMiddleware {
    private httpUtils: HttpUtils;
    private clientRedis: RedisClientType;

    constructor() {
        this.httpUtils = new HttpUtils();
        this.clientRedis = redisClient;

        this.authToken = this.authToken.bind(this);
    }

    async authToken(req: Request, res: Response, next: (error?: Error | any) => void) {
        try {
            const token = (req.query?.auth as string) || null;

            if(!token) {
                this.httpUtils.UnAuthorization(res, new Error("not token in auth"));
                return;
            }

            const accessKey = await this.clientRedis.get(token);
            if(!accessKey) {
                this.httpUtils.UnAuthorization(res, new Error("token not exist"));
                return;
            }



            next();
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const authMiddleware = new AuthMiddleware();