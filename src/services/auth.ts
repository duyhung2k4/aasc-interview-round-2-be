import pgClient from "../config/connect";
import dayjs from "dayjs";
import { Client, QueryConfig } from "pg";
import { RegisterRequest, BitrixInstallRequest, AcceptCodeRequest, LoginRequest } from "../dto/request/auth";
import { BitrixModel } from "../models/bitrix";
import { TokenModel } from "../models/token";
import { AcceptCodeModel } from "../models/accept_code";
import { SercurityUtils } from "../utils/sercurity";



export class AuthService {
    private pgClient: Client;
    private sercurityUtils: SercurityUtils;

    constructor() {
        this.pgClient = pgClient;
        this.sercurityUtils = new SercurityUtils();

        this.installApp = this.installApp.bind(this);
        this.createAccpetCode = this.createAccpetCode.bind(this);
        this.login = this.login.bind(this);
    }

    async installApp(payload: BitrixInstallRequest, client_id: string): Promise<BitrixModel | Error> {
        try {
            await this.pgClient.query("BEGIN");
            let bitrix: BitrixModel | null = null;

            const queryBitrix: QueryConfig = {
                text: `SELECT * FROM bitrixs WHERE application_token = $1`,
                values: [payload["auth[application_token]"]],
            }
            const resultBitrix = await this.pgClient.query<BitrixModel>(queryBitrix);

            switch (`${resultBitrix.rowCount}`) {
                case "0":
                    const queryInsertBitrix: QueryConfig = {
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
                    }

                    const resultInsertBitrix = await this.pgClient.query<BitrixModel>(queryInsertBitrix);
                    if (resultInsertBitrix.rowCount === 0) {
                        throw new Error("insert bitrixs errors");
                    }

                    bitrix = resultInsertBitrix.rows[0];
                    break;
                case "1":
                    const queryUpdateBitrix: QueryConfig = {
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
                    }

                    const resultUpdateBitrix = await this.pgClient.query<BitrixModel>(queryUpdateBitrix);
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

            const queryDeleteOldToken: QueryConfig = {
                text: `DELETE FROM tokens WHERE bitrix_id = $1`,
                values: [bitrix.id]
            }
            await this.pgClient.query(queryDeleteOldToken);

            const queryCreateToken: QueryConfig = {
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
            }

            const resultToken = await this.pgClient.query<TokenModel>(queryCreateToken);
            if (resultToken.rowCount === 0) {
                throw new Error("errors insert token");
            }

            await this.pgClient.query("COMMIT");

            bitrix.token = resultToken.rows[0];
            return bitrix;
        } catch (error) {
            console.log(error);
            await this.pgClient.query("ROLLBACK");
            return new Error(JSON.stringify(error));
        }
    }


    async createAccpetCode(payload: RegisterRequest): Promise<AcceptCodeModel | Error> {
        try {
            const queryBitrix: QueryConfig = {
                text: `SELECT * FROM bitrixs WHERE client_id = $1 AND client_secret IS NULL`,
                values: [payload.client_id]
            }

            const resultBitrix = await this.pgClient.query<BitrixModel>(queryBitrix);
            if(resultBitrix.rows.length > 0) {
                throw new Error("exist account");
            }

            const passwordHash = this.sercurityUtils.hashPassword(payload.password);
            if (passwordHash instanceof Error) {
                throw new Error("hash password error");
            }

            const queryAcceptCode: QueryConfig = {
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
                    dayjs().add(60, "second").toDate(),
                    this.sercurityUtils.generateRandomSixDigitString(),
                    payload.email,
                    payload.client_id,
                    payload.client_secret,
                    passwordHash,
                ]
            }

            const result = await this.pgClient.query<AcceptCodeModel>(queryAcceptCode);
            if (result.rowCount === 0) {
                throw new Error("create accept code error");
            }

            return result.rows[0];
        } catch (error) {
            return new Error(JSON.stringify(error));
        }
    }

    async acceptCode(payload: AcceptCodeRequest): Promise<boolean | Error> {
        try {
            const queryAcceptCode: QueryConfig = {
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
                    dayjs().toDate(),
                ],
            }

            const result = await this.pgClient.query<AcceptCodeModel>(queryAcceptCode);

            if(result.rowCount === 0) {
                return false;
            }

            const acceptCodeResult = result.rows[0];

            const queryUpdateBitrix: QueryConfig = {
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
                    dayjs().toDate(),
                    acceptCodeResult.client_id,
                ],
            }

            await this.pgClient.query<BitrixModel>(queryUpdateBitrix);

            return true;
        } catch (error) {
            return new Error(JSON.stringify(error));
        }
    }

    async login(payload: LoginRequest): Promise<BitrixModel | Error> {
        try {
            const queryBitrix: QueryConfig = {
                text: `
                    SELECT * FROM bitrixs
                    WHERE client_id = $1
                `,
                values: [payload.client_id]
            }

            const result = await this.pgClient.query<BitrixModel>(queryBitrix);
            if(!result.rowCount) {
                throw new Error("bitrixs not found");
            }

            const isPasswordTrue = await this.sercurityUtils.comparePassword(payload.password, result.rows[0].password);
            if(isPasswordTrue instanceof Error) {
                throw new Error(JSON.stringify(isPasswordTrue));
            }

            if(!isPasswordTrue) {
                throw new Error("password wrong");
            }

            return result.rows[0];
        } catch (error) {
            return new Error(JSON.stringify(error));
        }
    }
}

export const authService = new AuthService();