import * as jwt from "jsonwebtoken";
import * as fs from "fs";



export class JwtUtils {
    private privateKey: Buffer

    constructor() {
        this.privateKey = fs.readFileSync('src/keys/private.key');
    }

    createToken(payload: TokenInfoPayload, type: TokenType): string {
        const token: string = jwt.sign(payload, this.privateKey, {
            expiresIn: 24 * 60 * 60 * (type === "access_token" ? 1 : 3),
            algorithm: "RS256",
        });

        return token;
    }

    async verifyToken(token: string): Promise<TokenInfoResult | Error> {
        try {
            const data = jwt.verify(token, this.privateKey) as Record<string, any>;
            return data as TokenInfoResult;
        } catch (error) {
            return new Error(JSON.stringify(error));
        }
    }

    getTokenResut(token: string): TokenInfoResult | Error {
        try {
            const tokenInfoResult = jwt.verify(token, this.privateKey) as TokenInfoResult;

            return tokenInfoResult;
        } catch (error) {
            return new Error(JSON.stringify(error));
        }
    }
}



export type TokenType = "access_token" | "refresh_token";

export type TokenInfoPayload = {
    bitrix_id: number
    client_id: string
}

export type TokenInfoResult = TokenInfoPayload & {
    iat: number
    exp: number
}