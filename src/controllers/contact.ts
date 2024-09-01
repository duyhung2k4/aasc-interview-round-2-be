import HttpUtils from "../utils/http";

import { Request, Response } from "express";
import { AddContactRequest, UpdateContactRequest } from "../dto/request/contact";
import { QueryUtils } from "../utils/query";
import { API_BITRIX } from "../constant/api";
import { AddContactResult, ListContactResult } from "../dto/response/contact";
import { RedisClientType } from "redis";
import { redisClient } from "../config/connect";
import { ContactModel } from "../models/contact";
import { ListBankResult } from "../dto/response/bank";



export class ContactController {
    private httpUtils: HttpUtils;
    private queryUtils: QueryUtils;
    private clientRedis: RedisClientType;

    constructor() {
        this.httpUtils = new HttpUtils();
        this.queryUtils = new QueryUtils();
        this.clientRedis = redisClient;

        this.test = this.test.bind(this);
        this.listContact = this.listContact.bind(this);
        this.addContact = this.addContact.bind(this);
        this.updateContact = this.updateContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
    }



    async test(req: Request, res: Response) {
        try {
            this.httpUtils.SuccessResponse(req, res, { mess: "done" });
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
                    data: {
                        fields: {
                            ...data,
                            "OPENED": "Y",
                        },
                    },
                    params: {
                        auth,
                    }
                }
            });



            if (req.query.newToken) {
                this.httpUtils.SuccessResponse(req, res, result);
                return;
            }

            this.httpUtils.SuccessResponse(req, res, result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, error as Error);
        }
    }

    async listContact(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };
            if (!auth) {
                throw new Error("auth not found");
            }

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };

            const resultList = await this.queryUtils.axiosBaseQuery<ListContactResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "GET",
                    url: API_BITRIX.CRM.contact.list,
                    params: {
                        auth,
                    }
                }
            });

            if (resultList instanceof Error) {
                throw resultList;
            }

            this.httpUtils.SuccessResponse(req, res, resultList.result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, error as Error);
        }
    }

    async updateContact(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };
            const dataUpdate = req.body as UpdateContactRequest;

            if (!auth) {
                throw new Error("auth not found");
            }
            if (!dataUpdate.id || !dataUpdate.fields) {
                throw new Error("id and fields must require");
            }

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };



            const resultUpdate = await this.queryUtils.axiosBaseQuery<ContactModel[]>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: API_BITRIX.CRM.contact.update,
                    params: { auth },
                    data: dataUpdate,
                }
            });

            if (resultUpdate instanceof Error) {
                throw resultUpdate;
            }

            this.httpUtils.SuccessResponse(req, res, resultUpdate);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, error as Error);
        }
    }

    async deleteContact(req: Request, res: Response) {
        try {
            const { auth } = req.query as { auth: string };
            const { id, requisiteId } = req.body as { id: string, requisiteId: string };

            if (!auth) {
                throw new Error("auth not found");
            }
            if (!id) {
                throw new Error("id must require");
            }

            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey) as { bitrixUrl: string };


            const resultBank = await this.queryUtils.axiosBaseQuery<ListBankResult>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "GET",
                    url: API_BITRIX.CRM.bank.list,
                    params: { 
                        auth,
                        filter: { "ENTITY_ID": requisiteId}
                    },
                }
            });

            if(resultBank instanceof Error) {
                throw resultBank;
            }

            if(resultBank.result.length > 0) {
                throw new Error("need delete all bank of contact");
            }
            


            const resultDelete = await this.queryUtils.axiosBaseQuery<ContactModel[]>({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: API_BITRIX.CRM.contact.delete,
                    params: { auth },
                    data: { id }
                }
            });

            if (resultDelete instanceof Error) {
                throw resultDelete;
            }

            this.httpUtils.SuccessResponse(req, res, resultDelete);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, error as Error);
        }
    }
}

export const contactController = new ContactController();