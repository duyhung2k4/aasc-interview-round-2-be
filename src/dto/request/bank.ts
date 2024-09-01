export type AddBankRequest = {
    ENTITY_ID: string
    NAME: string
    RQ_BANK_NAME: string
    RQ_ACC_NUM: string
}

export type UpdateBankRequest = {
    id: string
    fields: {
        NAME: string
        RQ_BANK_NAME: string
        RQ_ACC_NUM: string
    }
}

export type DeleteBankRequest = {
    id: string
}