import { Request, Response } from "express";
import HttpUtils from "../utils/http";
import { AddContactRequest } from "../dto/request/contact";
import { QueryUtils } from "../utils/query";
import { API_BITRIX } from "../constant/api";
import { AddContactResult } from "../dto/response/contact";
import { RedisClientType } from "redis";
import { redisClient } from "../config/connect";
import { AuthService } from "../services/auth";

export class ContactController {
    private httpUtils: HttpUtils;
    private queryUtils: QueryUtils;
    private clientRedis: RedisClientType;
    private authService: AuthService;

    constructor() {
        this.httpUtils = new HttpUtils();
        this.queryUtils = new QueryUtils();
        this.authService = new AuthService();
        this.clientRedis = redisClient;

        this.test = this.test.bind(this);
        this.addContact = this.addContact.bind(this);
    }



    async test(req: Request, res: Response) {
        try {
            this.httpUtils.SuccessResponse(res, { mess: "done" });
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async addContact(req: Request, res: Response) {
        try {
            const data = req.body as AddContactRequest;
            const { auth } = req.query as { auth: string };

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };

            const result = await this.queryUtils.axiosBaseQuery<AddContactResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    url: API_BITRIX.CRM.contact.add,
                    method: "POST",
                    data,
                    params: {
                        auth,
                    }
                }
            });

            console.log(result);
            console.log(Object.keys(result));
            
            if (result instanceof Error && JSON.parse(result.message)?.error !== "expired_token") {
                throw new Error(JSON.stringify(result));
            }

            const newToken = await this.authService.getToken(auth);
            if(newToken instanceof Error) {
                throw new Error(JSON.stringify(newToken));
            };

            const resultRepeat = await this.queryUtils.axiosBaseQuery<AddContactResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    url: API_BITRIX.CRM.contact.add,
                    method: "POST",
                    data,
                    params: {
                        auth: newToken,
                    }
                }
            });

            this.httpUtils.SuccessResponse(res, resultRepeat, newToken);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, error as Error);
        }
    }
}

export const contactController = new ContactController();