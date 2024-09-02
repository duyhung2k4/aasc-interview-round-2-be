"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankController = exports.BankController = void 0;
const http_1 = __importDefault(require("../utils/http"));
const query_1 = require("../utils/query");
const connect_1 = require("../config/connect");
const api_1 = require("../constant/api");
class BankController {
    httpUtils;
    queryUtils;
    clientRedis;
    constructor() {
        this.clientRedis = connect_1.redisClient;
        this.httpUtils = new http_1.default();
        this.queryUtils = new query_1.QueryUtils();
        this.listBank = this.listBank.bind(this);
        this.addBank = this.addBank.bind(this);
        this.updateBank = this.updateBank.bind(this);
        this.deleteBank = this.deleteBank.bind(this);
    }
    async listBank(req, res) {
        try {
            const { auth } = req.query;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const result = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "GET",
                    url: api_1.API_BITRIX.CRM.bank.list,
                    params: { auth }
                }
            });
            if (result instanceof Error) {
                throw result;
            }
            this.httpUtils.SuccessResponse(req, res, result.result);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async addBank(req, res) {
        try {
            const { auth } = req.query;
            const dataAdd = req.body;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const result = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: api_1.API_BITRIX.CRM.bank.add,
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
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async updateBank(req, res) {
        try {
            const { auth } = req.query;
            const dataUpdate = req.body;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const result = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: api_1.API_BITRIX.CRM.bank.update,
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
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async deleteBank(req, res) {
        try {
            const { auth } = req.query;
            const dataDelete = req.body;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const result = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: api_1.API_BITRIX.CRM.bank.delete,
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
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}
exports.BankController = BankController;
exports.bankController = new BankController();
