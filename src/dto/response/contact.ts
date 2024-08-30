import { ContactModel } from "../../models/contact"
import { TimeModel } from "../../models/time"

export type  AddContactResult = {
    result: number
    time: TimeModel
}

export type ListContactResult = {
    result: ContactModel[]
    time: TimeModel
    total: number
}