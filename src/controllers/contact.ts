import { Request, Response } from "express";
import HttpUtils from "../utils/http";
import { AddContactRequest } from "../dto/request/contact";
import { QueryUtils } from "../utils/query";
import { API_BITRIX } from "../constant/api";
import { ContactModel } from "../models/contact";
import { AddContactResult } from "../dto/response/contact";

export class ContactController {
    private httpUtils: HttpUtils;
    private queryUtils: QueryUtils;

    constructor() {
        this.httpUtils = new HttpUtils();
        this.queryUtils = new QueryUtils();

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

            const result = await this.queryUtils.axiosBaseQuery<AddContactResult>({
                baseUrl: "https://b24-pgh6d1.bitrix24.vn/rest/",
                data: {
                    url: API_BITRIX.CRM.contact.add,
                    method: "POST",
                    data,
                    params: {
                        auth,
                    }
                }
            });

            if (result instanceof Error) {
                throw new Error(JSON.stringify(result));
            }

            this.httpUtils.SuccessResponse(res, result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const contactController = new ContactController();