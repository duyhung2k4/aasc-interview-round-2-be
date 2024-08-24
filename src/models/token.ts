import { BaseModel } from "./base";
import { BitrixModel } from "./bitrix";

export type TokenModel = BaseModel & {
    bitrix_id: number
    expires: string
    expires_in: number
    access_token: string
    refresh_token: string

    bitrix: BitrixModel | null
}