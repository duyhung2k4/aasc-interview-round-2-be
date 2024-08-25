export type BitrixInstallRequest = {
    event: string
    event_handler_id: string
    "data[VERSION]": string
    "data[ACTIVE]": string
    "data[INSTALLED]": string
    "data[LANGUAGE_ID]": string
    ts: string
    "auth[access_token]": string
    "auth[expires]": string
    "auth[expires_in]": string
    "auth[scope]": string
    "auth[domain]": string
    "auth[server_endpoint]": string
    "auth[status]": string
    "auth[client_endpoint]": string
    "auth[member_id]": string
    "auth[user_id]": string
    "auth[refresh_token]": string
    "auth[application_token]": string
}

export type RegisterRequest = {
    email: string
    client_id: string
    client_secret: string
    password: string
}

export type AcceptCodeRequest = {
    accept_code_id: number
    code: string
}

export type LoginRequest = {
    client_id: string
    password: string
}