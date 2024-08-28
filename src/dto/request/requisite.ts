export type AddRequisiteRequest = {
    "NAME": string
    "ENTITY_ID": string
    "RQ_NAME": string
    "RQ_BANK_NAME": string
    "RQ_ACC_NUM": string
}

export type UpdateRequisiteRequest = {
    id: string
    fields: {
        "NAME"?: string
        "ENTITY_ID"?: string
        "RQ_NAME"?: string
        "RQ_BANK_NAME"?: string
        "RQ_ACC_NUM"?: string
    }
}

export type DeleteRequisiteRequest = {
    id: string
}