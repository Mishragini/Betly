import { Request } from "express";

export enum Role {
    user = "user",
    admin = "admin"
}

export interface User {
    id: string,
    email: string,
    password: string,
    role: Role
}

export interface authenticatedReq extends Request {
    user?: User
}