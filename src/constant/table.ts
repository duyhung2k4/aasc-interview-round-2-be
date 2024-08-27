export const COLUMN_BASE = ["id", "created_at", "updated_at", "deleted_at"];

export const COLUMN_TABLE = {
    accept_codes: [...COLUMN_BASE, "expires", "expires_repeat_code", "code", "email", "client_id", "client_secret", "password"],
    bitrixs: [...COLUMN_BASE, "member_id", "application_token", "client_id", "client_secret", "email", "password", "domain", "server_endpoint", "client_endpoint", "active"],
    tokens: [...COLUMN_BASE, "bitrix_id", "expires", "expires_in", "access_token", "refresh_token"]
}