import { TimeModel } from "../../models/time"

export type  AddRequisiteResult = {
    result: number
    time: TimeModel
}

export type  UpdateRequisiteResult = {
    result: boolean
    time: TimeModel
}

export type  DeleteRequisiteResult = {
    result: boolean
    time: TimeModel
}