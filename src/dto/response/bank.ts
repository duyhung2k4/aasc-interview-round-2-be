import { BankModel } from "../../models/bank"
import { TimeModel } from "../../models/time"

export type  AddBankResult = {
    result: number
    time: TimeModel
}

export type  UpdateBankResult = {
    result: boolean
    time: TimeModel
}

export type  DeleteBankResult = {
    result: boolean
    time: TimeModel
}

export type ListBankResult = {
    result: BankModel[]
    time: TimeModel
    total: number
}