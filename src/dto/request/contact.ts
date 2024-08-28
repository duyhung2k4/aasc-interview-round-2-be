import { CRM_Multifield } from "../../models/crm_multifield"

export type AddContactRequest = {
    "NAME": string
    "LAST_NAME": string
    "ADDRESS_REGION": string
    "ADDRESS_PROVINCE": string
    "ADDRESS_CITY": string
    "PHONE": CRM_Multifield[]
    "EMAIL": CRM_Multifield[]
    "WEB": CRM_Multifield[]
}

export type UpdateContactRequest = {
    id: string
    fields: {
        "NAME"?: string
        "LAST_NAME"?: string
        "ADDRESS_REGION"?: string
        "ADDRESS_PROVINCE"?: string
        "ADDRESS_CITY"?: string
        "PHONE"?: CRM_Multifield[]
        "EMAIL"?: CRM_Multifield[]
        "WEB"?: CRM_Multifield[]
    }
}