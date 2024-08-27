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
}

export type OAuthResponse = {
    access_token: string;
    expires: number;
    expires_in: number;
    scope: string;
    domain: string;
    server_endpoint: string;
    status: string;
    client_endpoint: string;
    member_id: string;
    user_id: number;
    refresh_token: string;
}