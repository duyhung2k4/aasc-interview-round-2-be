import HttpUtils from "../utils/http";
import { Request, Response } from "express";

export class AuthMiddleware {
    private httpUtils: HttpUtils;

    constructor() {
        this.httpUtils = new HttpUtils();

        this.authToken = this.authToken.bind(this);
    }

    async authToken(req: Request, res: Response, next: (error?: Error | any) => void) {
        try {
            const token = req.query?.auth || null;

            if(!token) {
                this.httpUtils.UnAuthorization(res, new Error("not token"));
                return;
            }

            next();
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const authMiddleware = new AuthMiddleware();