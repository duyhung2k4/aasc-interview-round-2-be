export type AppInfoResponse = {
    ID: number
    CODE: string
    VERSION: number
    STATUS: string
    INSTALLED: boolean
    PAYMENT_EXPIRED: string
    DAYS: number | null
    LANGUAGE_ID: string
    LICENSE: string
    LICENSE_PREVIOUS: string
    LICENSE_TYPE: string
    LICENSE_FAMILY: string
}

export type RegisterRepsone = {
    id_accept_code: number
    expires: Date
    expires_repeat_code: Date
}

export type LoginResponse = {
    access_token: string
    refresh_token: string
}