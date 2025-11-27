import { Router } from "express";
import { authSchema } from "../utils/validation";
import { getErrorMessage, handleRes } from "../utils/responseHandler";
import { prisma } from "@repo/db"
import * as bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET, NODE_ENV } from "../utils/config";

const userRouter: Router = Router()

userRouter.post("/signup", async (req, res) => {
    try {
        const { success, data, error } = authSchema.safeParse(req.body)
        if (error) {
            const errors = error.issues.map(err => ({
                message: err.message,
            }));

            await handleRes(res, 400, {}, errors);
            return;
        }
        const { email, password } = data

        const existingUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (existingUser) {
            const error = { message: `A user with ${email} already exists!` }
            await handleRes(res, 400, {}, [error])
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })

        const token = jwt.sign(user, JWT_SECRET)

        res.cookie("authToken", token,
            {
                httpOnly: true,
                maxAge: 24 * 3600000,
                secure: NODE_ENV === "production" ? true : false,
            }
        )

        await handleRes(res, 200, user)
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})

userRouter.post("/signin", async (req, res) => {
    try {
        const { error, data } = authSchema.safeParse(req.body)
        if (error) {
            const errors = error.issues.map((err) => {
                return {
                    message: err.message
                }
            })

            await handleRes(res, 400, {}, errors)
            return
        }
        const { email, password } = data
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            const error = {
                message: `User with ${email} doesn't exist. Please signup first`
            }
            await handleRes(res, 400, {}, [error])
            return
        }

        const hashedPassword = user.password

        const passwordMatch = await bcrypt.compare(password, hashedPassword)

        if (!passwordMatch) {
            const error = {
                message: `Wrong Password.`
            }
            await handleRes(res, 400, {}, [error])
            return
        }
        const authToken = jwt.sign(user, JWT_SECRET)

        res.cookie("authToken", authToken, {
            httpOnly: true,
            maxAge: 24 * 36000,
            secure: NODE_ENV === "production" ? true : false
        })


        await handleRes(res, 200, { authToken })


    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})


userRouter.get("/me", async (req, res) => {
    try {
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


        await handleRes(res, 200, decoded)


    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})

export default userRouter;