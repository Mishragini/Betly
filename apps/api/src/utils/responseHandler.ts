import { Response } from "express";

interface resError {
    message: string
}


export async function handleRes<T>(res: Response, statusCode: number, data?: T, errors?: resError[]) {
    let success = true
    if (statusCode !== 200) {
        success = false
    }
    res.status(statusCode).json({ success, data, errors })
}


export function getErrorMessage<T>(error: T) {
    return error instanceof Error ? error.message : "Something went wrong"
}