import { Request, Response } from "express";
import HttpUtils from "../utils/http";
import { JwtUtils } from "../utils/jwt";

export class AuthMiddleware {
    private jwtUtils: JwtUtils;
    private httpUtils: HttpUtils;

    constructor() {
        this.jwtUtils = new JwtUtils();
        this.httpUtils = new HttpUtils();

        this.authToken = this.authToken.bind(this);
    }

    async authToken(req: Request, res: Response, next: (error?: Error | any) => void) {
        try {
            const token = (req.headers.authorization || "").split(" ")?.[1];

            if(!token) {
                this.httpUtils.UnAuthorization(res, new Error("not token"));
                return;
            }
            
            const result = await this.jwtUtils.verifyToken(token);

            if(result instanceof Error) {
                this.httpUtils.UnAuthorization(res, result);
                return;
            }

            next();
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const authMiddleware = new AuthMiddleware();