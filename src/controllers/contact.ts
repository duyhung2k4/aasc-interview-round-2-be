import { Request, Response } from "express";
import HttpUtils from "../utils/http";

export class ContactController {
    private httpUtils: HttpUtils;

    constructor() {
        this.httpUtils = new HttpUtils();

        this.test = this.test.bind(this);
    }

    async test(req: Request, res: Response) {
        try {
            this.httpUtils.SuccessResponse(res, { mess: "done" });
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const contactController = new ContactController();