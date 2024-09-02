"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryUtils = void 0;
const axios_1 = __importDefault(require("axios"));
class QueryUtils {
    async axiosBaseQuery(payload) {
        try {
            const result = await (0, axios_1.default)({
                url: `${payload.baseUrl}${payload.data.url}`,
                method: payload.data.method,
                data: payload.data.data,
                params: payload.data.params,
                timeout: 10000,
            });
            return result.data;
        }
        catch (axiosError) {
            const error = axiosError;
            return new Error(JSON.stringify(error?.response?.data));
        }
    }
}
exports.QueryUtils = QueryUtils;
