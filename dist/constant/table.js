"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLUMN_TABLE = exports.COLUMN_BASE = void 0;
exports.COLUMN_BASE = ["id", "created_at", "updated_at", "deleted_at"];
exports.COLUMN_TABLE = {
    accept_codes: [...exports.COLUMN_BASE, "expires", "expires_repeat_code", "code", "email", "client_id", "client_secret", "password"],
    bitrixs: [...exports.COLUMN_BASE, "member_id", "application_token", "client_id", "client_secret", "email", "password", "domain", "server_endpoint", "client_endpoint", "active"],
    tokens: [...exports.COLUMN_BASE, "bitrix_id", "expires", "expires_in", "access_token", "refresh_token"]
};
