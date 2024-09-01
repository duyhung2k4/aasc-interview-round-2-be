import HttpUtils from "../utils/http";

import { Request, Response } from "express";
import { QueryUtils } from "../utils/query";
import { RedisClientType } from "redis";
import { redisClient } from "../config/connect";
import { BitrixInfoRedis } from "../models/redis";
import { API_BITRIX } from "../constant/api";
import { AddBankResult, DeleteBankResult, ListBankResult, UpdateBankResult } from "../dto/response/bank";
import { AddBankRequest, DeleteBankRequest, UpdateBankRequest } from "../dto/request/bank";



export class BankController {
    private httpUtils: HttpUtils;
    private queryUtils: QueryUtils;
    private clientRedis: RedisClientType;

    constructor() {
        this.clientRedis = redisClient;
        this.httpUtils = new HttpUtils();
        this.queryUtils = new QueryUtils();

        this.listBank = this.listBank.bind(this);
        this.addBank = this.addBank.bind(this);
        this.updateBank = this.updateBank.bind(this);
        this.deleteBank = this.deleteBank.bind(this);
    }



    async listBank(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };

            const dataAccessKey = await this.clientRedis.get(auth);

            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as BitrixInfoRedis;



            const result = await this.queryUtils.axiosBaseQuery<ListBankResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "GET",
                    url: API_BITRIX.CRM.bank.list,
                    params: { auth }
                }
            });

            if (result instanceof Error) {
                throw result;
            }

            this.httpUtils.SuccessResponse(req, res, result.result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async addBank(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };
            const dataAdd = req.body as AddBankRequest;

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };

            const result = await this.queryUtils.axiosBaseQuery<AddBankResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: API_BITRIX.CRM.bank.add,
                    data: {
                        fields: {
                            ...dataAdd,
                            "ENTITY_TYPE_ID": 8,
                            "ACTIVE": "Y",
                        }
                    },
                    params: { auth }
                }
            });

            if (result instanceof Error) {
                throw result;
            }

            this.httpUtils.SuccessResponse(req, res, result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async updateBank(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };
            const dataUpdate = req.body as UpdateBankRequest;

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };

            const result = await this.queryUtils.axiosBaseQuery<UpdateBankResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: API_BITRIX.CRM.bank.update,
                    data: {
                        id: dataUpdate.id,
                        fields: {
                            ...dataUpdate.fields,
                            "ENTITY_TYPE_ID": 8,
                        }
                    },
                    params: { auth }
                }
            });

            if (result instanceof Error) {
                throw result;
            }

            this.httpUtils.SuccessResponse(req, res, result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async deleteBank(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };
            const dataDelete = req.body as DeleteBankRequest;

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };


            const result = await this.queryUtils.axiosBaseQuery<DeleteBankResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: API_BITRIX.CRM.bank.delete,
                    data: {
                        id: dataDelete.id,
                    },
                    params: { auth }
                }
            });

            if (result instanceof Error) {
                throw result;
            }

            this.httpUtils.SuccessResponse(req, res, result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const bankController = new BankController();