"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = exports.ContactController = void 0;
const http_1 = __importDefault(require("../utils/http"));
const query_1 = require("../utils/query");
const api_1 = require("../constant/api");
const connect_1 = require("../config/connect");
class ContactController {
    httpUtils;
    queryUtils;
    clientRedis;
    constructor() {
        this.httpUtils = new http_1.default();
        this.queryUtils = new query_1.QueryUtils();
        this.clientRedis = connect_1.redisClient;
        this.test = this.test.bind(this);
        this.listContact = this.listContact.bind(this);
        this.addContact = this.addContact.bind(this);
        this.updateContact = this.updateContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
    }
    async test(req, res) {
        try {
            this.httpUtils.SuccessResponse(req, res, { mess: "done" });
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async addContact(req, res) {
        try {
            const data = req.body;
            const { auth } = req.query;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const result = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    url: api_1.API_BITRIX.CRM.contact.add,
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
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, error);
        }
    }
    async listContact(req, res) {
        try {
            const { auth } = req.query;
            if (!auth) {
                throw new Error("auth not found");
            }
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const resultList = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "GET",
                    url: api_1.API_BITRIX.CRM.contact.list,
                    params: {
                        auth,
                    }
                }
            });
            if (resultList instanceof Error) {
                throw resultList;
            }
            this.httpUtils.SuccessResponse(req, res, resultList.result);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, error);
        }
    }
    async updateContact(req, res) {
        try {
            const { auth } = req.query;
            const dataUpdate = req.body;
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
            const bitrixData = JSON.parse(dataAccessKey);
            const resultUpdate = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: api_1.API_BITRIX.CRM.contact.update,
                    params: { auth },
                    data: dataUpdate,
                }
            });
            if (resultUpdate instanceof Error) {
                throw resultUpdate;
            }
            this.httpUtils.SuccessResponse(req, res, resultUpdate);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, error);
        }
    }
    async deleteContact(req, res) {
        try {
            const { auth } = req.query;
            const { id, requisiteId } = req.body;
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
            const bitrixData = JSON.parse(dataAccessKey);
            const resultBank = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "GET",
                    url: api_1.API_BITRIX.CRM.bank.list,
                    params: {
                        auth,
                        filter: { "ENTITY_ID": requisiteId }
                    },
                }
            });
            if (resultBank instanceof Error) {
                throw resultBank;
            }
            if (resultBank.result.length > 0) {
                throw new Error("need delete all bank of contact");
            }
            const resultDelete = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: api_1.API_BITRIX.CRM.contact.delete,
                    params: { auth },
                    data: { id }
                }
            });
            if (resultDelete instanceof Error) {
                throw resultDelete;
            }
            this.httpUtils.SuccessResponse(req, res, resultDelete);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, error);
        }
    }
}
exports.ContactController = ContactController;
exports.contactController = new ContactController();
