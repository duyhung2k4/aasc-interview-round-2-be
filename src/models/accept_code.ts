import { BaseModel } from "./base";

export type AcceptCodeModel = BaseModel & {
    expires: Date
    expires_repeat_code: Date
    code: string
    email: string
    client_id: string
    client_secret: string
    password: string
}