"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const connect_1 = require("../config/connect");
const sercurity_1 = require("../utils/sercurity");
const table_1 = require("../constant/table");
const query_1 = require("../utils/query");
class AuthService {
    pgClient;
    sercurityUtils;
    queryUtils;
    clientRedis;
    constructor() {
        this.pgClient = connect_1.pgClient;
        this.sercurityUtils = new sercurity_1.SercurityUtils();
        this.queryUtils = new query_1.QueryUtils();
        this.clientRedis = connect_1.redisClient;
        this._getBitrix = this._getBitrix.bind(this);
        this.installApp = this.installApp.bind(this);
        this.createAcceptCode = this.createAcceptCode.bind(this);
        this.login = this.login.bind(this);
        this.getToken = this.getToken.bind(this);
    }
    async _getBitrix(conditions) {
        try {
            let bitrixResult = {
                token: {}
            };
            const c_bitrixs = table_1.COLUMN_TABLE.bitrixs.map(c => `b.${c} as b__${c}`);
            const c_tokens = table_1.COLUMN_TABLE.tokens.map(c => `t.${c} as t__${c}`);
            const queryBitrix = {
                text: `
                    SELECT
                        ${c_bitrixs.join(",")},
                        ${c_tokens.join(",")}
                    FROM bitrixs as b
                    JOIN tokens as t ON t.bitrix_id = b.id
                    WHERE ${conditions.map((c, i) => `${c.field} = $${i + 1}`).join(" AND ")}
                `,
                values: [...conditions.map(c => c.value)],
            };
            const result = await this.pgClient.query(queryBitrix);
            if (!result.rowCount) {
                throw new Error("bitrixs not found");
            }
            Object.keys(result.rows[0]).forEach(key => {
                const type = key.split("__")[0];
                const field = key.split("__")[1];
                switch (type) {
                    case "b":
                        bitrixResult[field] = result.rows[0][key];
                        break;
                    case "t":
                        bitrixResult.token[field] = result.rows[0][key];
                        break;
                    default:
                        break;
                }
            });
            const bitrixRes = bitrixResult;
            return bitrixRes;
        }
        catch (error) {
            return error;
        }
    }
    async installApp(payload, client_id) {
        try {
            await this.pgClient.query("BEGIN");
            let bitrix = null;
            const queryBitrix = {
                text: `SELECT * FROM bitrixs WHERE application_token = $1`,
                values: [payload["auth[application_token]"]],
            };
            const resultBitrix = await this.pgClient.query(queryBitrix);
            switch (`${resultBitrix.rowCount}`) {
                case "0":
                    const queryInsertBitrix = {
                        text: `
                            INSERT INTO bitrixs
                            (
                                member_id,
                                application_token,
                                domain,
                                server_endpoint,
                                client_endpoint,
                                client_id
                            )
                            VALUES
                            (
                                $1,
                                $2, 
                                $3,
                                $4,
                                $5,
                                $6
                            )
                            RETURNING *
                            `,
                        values: [
                            payload["auth[member_id]"],
                            payload["auth[application_token]"],
                            payload["auth[domain]"],
                            payload["auth[server_endpoint]"],
                            payload["auth[client_endpoint]"],
                            client_id,
                        ]
                    };
                    const resultInsertBitrix = await this.pgClient.query(queryInsertBitrix);
                    if (resultInsertBitrix.rowCount === 0) {
                        throw new Error("insert bitrixs errors");
                    }
                    bitrix = resultInsertBitrix.rows[0];
                    break;
                case "1":
                    const queryUpdateBitrix = {
                        text: `
                            UPDATE bitrixs 
                            SET 
                                domain = $1, 
                                server_endpoint = $2,
                                client_endpoint = $3
                            WHERE id = $4
                            RETURNING *
                            `,
                        values: [
                            resultBitrix.rows[0].domain,
                            resultBitrix.rows[0].server_endpoint,
                            resultBitrix.rows[0].client_endpoint,
                            resultBitrix.rows[0].id,
                        ]
                    };
                    const resultUpdateBitrix = await this.pgClient.query(queryUpdateBitrix);
                    if (resultUpdateBitrix.rowCount === 0) {
                        throw new Error("update bitrixs errors");
                    }
                    bitrix = resultUpdateBitrix.rows[0];
                    break;
                default:
                    break;
            }
            if (!bitrix) {
                throw new Error("bitrix null");
            }
            const queryDeleteOldToken = {
                text: `DELETE FROM tokens WHERE bitrix_id = $1`,
                values: [bitrix.id]
            };
            await this.pgClient.query(queryDeleteOldToken);
            const queryCreateToken = {
                text: `
                    INSERT INTO tokens
                    (
                        bitrix_id,
                        expires,
                        expires_in,
                        access_token,
                        refresh_token
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )
                        RETURNING *
                `,
                values: [
                    bitrix.id,
                    payload["auth[expires]"],
                    payload["auth[expires_in]"],
                    payload["auth[access_token]"],
                    payload["auth[refresh_token]"],
                ]
            };
            const resultToken = await this.pgClient.query(queryCreateToken);
            if (resultToken.rowCount === 0) {
                throw new Error("errors insert token");
            }
            await this.pgClient.query("COMMIT");
            bitrix.token = resultToken.rows[0];
            return bitrix;
        }
        catch (error) {
            console.log(error);
            await this.pgClient.query("ROLLBACK");
            return new Error(JSON.stringify(error));
        }
    }
    async createAcceptCode(payload) {
        try {
            const queryBitrix = {
                text: `SELECT * FROM bitrixs WHERE client_id = $1 AND client_secret IS NULL`,
                values: [payload.client_id]
            };
            const resultBitrix = await this.pgClient.query(queryBitrix);
            if (resultBitrix.rows.length > 0) {
                throw new Error("exist account");
            }
            const passwordHash = this.sercurityUtils.hashPassword(payload.password);
            if (passwordHash instanceof Error) {
                throw new Error("hash password error");
            }
            const queryAcceptCode = {
                text: `
                    INSERT INTO accept_codes
                    (
                        expires,
                        code,
                        email,
                        client_id,
                        client_secret,
                        password
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    )
                    RETURNING *
                `,
                values: [
                    (0, dayjs_1.default)().add(60, "second").toDate(),
                    this.sercurityUtils.generateRandomSixDigitString(),
                    payload.email,
                    payload.client_id,
                    payload.client_secret,
                    passwordHash,
                ]
            };
            const result = await this.pgClient.query(queryAcceptCode);
            if (result.rowCount === 0) {
                throw new Error("create accept code error");
            }
            return result.rows[0];
        }
        catch (error) {
            return new Error(JSON.stringify(error));
        }
    }
    async acceptCode(payload) {
        try {
            const queryAcceptCode = {
                text: `
                    SELECT * FROM accept_codes
                    WHERE 
                        id = $1 AND 
                        code = $2 AND
                        expires > $3
                `,
                values: [
                    payload.accept_code_id,
                    payload.code,
                    (0, dayjs_1.default)().toDate(),
                ],
            };
            const result = await this.pgClient.query(queryAcceptCode);
            if (result.rowCount === 0) {
                return false;
            }
            const acceptCodeResult = result.rows[0];
            const queryUpdateBitrix = {
                text: `
                    UPDATE bitrixs
                    SET
                        client_secret = $1,
                        email = $2,
                        password = $3,
                        updated_at = $4
                    WHERE
                        client_id = $5 AND
                        client_secret = '' AND
                        email = '' AND
                        password = ''
                `,
                values: [
                    acceptCodeResult.client_secret,
                    acceptCodeResult.email,
                    acceptCodeResult.password,
                    (0, dayjs_1.default)().toDate(),
                    acceptCodeResult.client_id,
                ],
            };
            await this.pgClient.query(queryUpdateBitrix);
            return true;
        }
        catch (error) {
            return new Error(JSON.stringify(error));
        }
    }
    async login(payload) {
        try {
            const bitrixRes = await this._getBitrix([
                { field: "b.client_id", value: payload.client_id },
            ]);
            if (bitrixRes instanceof Error) {
                throw new Error(JSON.stringify(bitrixRes));
            }
            const isPasswordTrue = await this.sercurityUtils.comparePassword(payload.password, bitrixRes.password);
            if (isPasswordTrue instanceof Error) {
                throw new Error(JSON.stringify(isPasswordTrue));
            }
            if (!isPasswordTrue) {
                throw new Error("password wrong");
            }
            return bitrixRes;
        }
        catch (error) {
            return new Error(JSON.stringify(error));
        }
    }
    async getToken(oldAccessToken) {
        try {
            const bitrixResult = await this._getBitrix([
                { field: "t.access_token", value: oldAccessToken }
            ]);
            if (bitrixResult instanceof Error) {
                throw new Error(JSON.stringify(bitrixResult));
            }
            ;
            if (!bitrixResult.token) {
                throw new Error("token in bitrix not found");
            }
            const bitrixTokenResult = await this.queryUtils.axiosBaseQuery({
                baseUrl: `${process.env.BITRIX_OAUTH}`,
                data: {
                    method: "GET",
                    url: "oauth/token",
                    params: {
                        refresh_token: bitrixResult.token.refresh_token,
                        client_secret: bitrixResult.client_secret,
                        grant_type: "refresh_token",
                        client_id: bitrixResult.client_id,
                    }
                }
            });
            if (bitrixTokenResult instanceof Error) {
                throw bitrixTokenResult;
            }
            const queryUpdateToken = {
                text: `
                    UPDATE tokens
                    SET
                        access_token = $1,
                        refresh_token = $2
                    WHERE access_token = $3
                    `,
                values: [
                    bitrixTokenResult.access_token,
                    bitrixTokenResult.refresh_token,
                    oldAccessToken,
                ]
            };
            await this.pgClient.query(queryUpdateToken);
            await this.clientRedis.set(bitrixTokenResult.access_token, JSON.stringify({
                bitrixUrl: bitrixTokenResult.client_endpoint,
                exp: dayjs_1.default.unix(bitrixTokenResult.expires).toDate(),
            }));
            await this.clientRedis.del([oldAccessToken]);
            return bitrixTokenResult.access_token;
        }
        catch (error) {
            return error;
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
