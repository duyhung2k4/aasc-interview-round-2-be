import { BaseModel } from "./base";
import { TokenModel } from "./token";

export type BitrixModel = BaseModel & {
    member_id: string
    application_token: string
    client_id: string
    client_secret: string
    email: string
    password: string
    domain: string
    server_endpoint: string
    client_endpoint: string
    active: boolean

    token: TokenModel | null
}