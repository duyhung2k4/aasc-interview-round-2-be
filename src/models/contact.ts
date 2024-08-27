import { CRM_Multifield } from "./crm_multifield"

export type ContactModel = {
    ID: number
    ADDRESS_REGION: string
    ADDRESS_PROVINCE: string
    ADDRESS_CITY: string
    PHONE: CRM_Multifield[]
    EMAIL: CRM_Multifield[]
    WEB: string[]
}