"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requisiteController = exports.RequisiteController = void 0;
const http_1 = __importDefault(require("../utils/http"));
const query_1 = require("../utils/query");
const connect_1 = require("../config/connect");
const api_1 = require("../constant/api");
class RequisiteController {
    httpUtils;
    queryUtils;
    clientRedis;
    constructor() {
        this.clientRedis = connect_1.redisClient;
        this.httpUtils = new http_1.default();
        this.queryUtils = new query_1.QueryUtils();
        this.listRequisite = this.listRequisite.bind(this);
        this.addRequisite = this.addRequisite.bind(this);
        this.updateRequisite = this.updateRequisite.bind(this);
        this.deleteRequisite = this.deleteRequisite.bind(this);
    }
    async listRequisite(req, res) {
        try {
            const { auth } = req.query;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const resultRequisite = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "GET",
                    url: api_1.API_BITRIX.CRM.requisite.list,
                    params: { auth }
                }
            });
            if (resultRequisite instanceof Error) {
                throw resultRequisite;
            }
            this.httpUtils.SuccessResponse(req, res, resultRequisite.result);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async addRequisite(req, res) {
        try {
            const { auth } = req.query;
            const dataAddRequisite = req.body;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const resultRequisite = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: api_1.API_BITRIX.CRM.requisite.add,
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
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async updateRequisite(req, res) {
        try {
            const { auth } = req.query;
            const dataUpdateRequisite = req.body;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            console.log({
                id: dataUpdateRequisite.id,
                fields: {
                    ...dataUpdateRequisite.fields,
                }
            });
            const resultRequisite = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: api_1.API_BITRIX.CRM.requisite.update,
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
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async deleteRequisite(req, res) {
        try {
            const { auth } = req.query;
            const dataDeleteRequisite = req.body;
            const dataAccessKey = await this.clientRedis.get(auth);
            if (!dataAccessKey) {
                throw new Error("token not exist");
            }
            const bitrixData = JSON.parse(dataAccessKey);
            const resultRequisite = await this.queryUtils.axiosBaseQuery({
                baseUrl: bitrixData.bitrixUrl,
                data: {
                    method: "POST",
                    url: api_1.API_BITRIX.CRM.requisite.delete,
                    data: {
                        id: dataDeleteRequisite.id,
                    },
                    params: { auth }
                }
            });
            if (resultRequisite instanceof Error) {
                throw resultRequisite;
            }
            this.httpUtils.SuccessResponse(req, res, resultRequisite);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}
exports.RequisiteController = RequisiteController;
exports.requisiteController = new RequisiteController();
