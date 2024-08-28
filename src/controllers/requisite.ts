import { AddRequisiteRequest, UpdateRequisiteRequest } from "../dto/request/requisite";
import HttpUtils from "../utils/http";
import { Request, Response } from "express";
import { QueryUtils } from "../utils/query";
import { RedisClientType } from "redis";
import { redisClient } from "../config/connect";
import { API_BITRIX } from "../constant/api";
import { AddRequisiteResult } from "../dto/response/requisite";



export class RequisiteController {
    private httpUtils: HttpUtils;
    private queryUtils: QueryUtils;
    private clientRedis: RedisClientType;

    constructor() {
        this.clientRedis = redisClient;
        this.httpUtils = new HttpUtils();
        this.queryUtils = new QueryUtils();



        this.listRequisite = this.listRequisite.bind(this);
        this.addRequisite = this.addRequisite.bind(this);
        this.updateRequisite = this.updateRequisite.bind(this);
        this.deleteRequisite = this.deleteRequisite.bind(this);

    }

    async listRequisite(req: Request, res: Response) {
        try {
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async addRequisite(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };
            const dataAddRequisite = req.body as AddRequisiteRequest;

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };

            const resultRequisite = await this.queryUtils.axiosBaseQuery<AddRequisiteResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: API_BITRIX.CRM.requisite.add,
                    data: {
                        fields: {
                            ...dataAddRequisite,
                            "ENTITY_TYPE_ID": 3,
                            "PRESET_ID": 1,
                        }
                    },
                    params: { auth }
                }
            });

            if (resultRequisite instanceof Error) {
                throw resultRequisite;
            }

            this.httpUtils.SuccessResponse(req, res, resultRequisite);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async updateRequisite(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };
            const dataUpdateRequisite = req.body as UpdateRequisiteRequest;

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };

            const resultRequisite = await this.queryUtils.axiosBaseQuery<AddRequisiteResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: API_BITRIX.CRM.requisite.update,
                    data: {
                        id: dataUpdateRequisite.id,
                        fields: {
                            ...dataUpdateRequisite.fields,
                        }
                    },
                    params: { auth }
                }
            });

            if (resultRequisite instanceof Error) {
                throw resultRequisite;
            }

            this.httpUtils.SuccessResponse(req, res, resultRequisite);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async deleteRequisite(req: Request, res: Response) {
        try {

        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const requisiteController = new RequisiteController();