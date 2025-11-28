import { NextFunction, Request, Response } from "express";
import { handleRes } from "./responseHandler";
import jwt, { JwtPayload } from "jsonwebtoken"
import { authenticatedReq, Role } from "./type";

async function getUserFromCookie(req: Request, res: Response) {
    const authToken = req.cookies.authToken;

    console.log("authToken", authToken)

    if (!authToken) {
        const error = {
            message: "Auth token cookie not found. Please sign in"
        }
        await handleRes(res, 400, {}, [error])
        return;
    }

    const decoded = jwt.decode(authToken) as JwtPayload

    if (!decoded) {
        const error = {
            message: "User not found in the decoded token."
        }

        await handleRes(res, 400, {}, [error])
        return
    }

    const user = {
        id: decoded.id,
        email: decoded.email,
        password: decoded.password,
        role: decoded.role
    }
    return user
}

export async function authMiddleWare(req: authenticatedReq, res: Response, next: NextFunction) {
    const user = await getUserFromCookie(req, res)
    req.user = user
    next()
}

export async function adminMiddleWare(req: authenticatedReq, res: Response, next: NextFunction) {
    const user = await getUserFromCookie(req, res)
    console.log("user.....", user)
    if (user?.role !== Role.admin) {
        await handleRes(res, 404, {}, [{ message: "You don't have admin rights to access this resource." }])
        return;
    }
    req.user = user
    next()
}

