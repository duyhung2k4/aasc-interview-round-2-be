"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpUtils {
    constructor() { }
    ErrorResponse(res, err) {
        const dataRes = {
            data: null,
            message: err.message,
            error: err,
            status: 502,
        };
        res.status(502).json(dataRes);
    }
    UnAuthorization(res, err) {
        const dataRes = {
            data: null,
            message: err.message,
            error: err,
            status: 401,
        };
        res.status(401).json(dataRes);
    }
    SuccessResponse(req, res, data) {
        const newToken = req.query.newToken;
        const dataRes = {
            data: data,
            message: "OK",
            error: null,
            status: 200,
            newToken,
        };
        res.status(200).json(dataRes);
    }
}
exports.default = HttpUtils;
