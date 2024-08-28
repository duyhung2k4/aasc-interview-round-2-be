import { CRM_Multifield } from "./crm_multifield"

export type ContactModel = {
    ID: number
    NAME: string
    LAST_NAME: string
    ADDRESS_REGION: string
    ADDRESS_PROVINCE: string
    ADDRESS_CITY: string
    PHONE: CRM_Multifield[]
    EMAIL: CRM_Multifield[]
    WEB: string[]
}