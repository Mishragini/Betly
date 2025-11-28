import { Router } from "express";
import { onrampSchema, signInSchema, signUpSchema } from "../utils/validation";
import { getErrorMessage, handleRes } from "../utils/responseHandler";
import { prisma } from "@repo/db"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET, NODE_ENV } from "../utils/config";
import { authMiddleWare } from "../utils/middleware";
import { authenticatedReq, User } from "../utils/type";

const userRouter: Router = Router()

userRouter.post("/signup", async (req, res) => {
    try {
        const { success, data, error } = signUpSchema.safeParse(req.body)
        if (error) {
            const errors = error.issues.map(err => ({
                message: err.message,
            }));

            await handleRes(res, 400, {}, errors);
            return;
        }
        const { email, password, role } = data

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
                password: hashedPassword,
                role
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

        await handleRes(res, 200, { message: "User created successfully!", user })
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})

userRouter.post("/signin", async (req, res) => {
    try {
        const { error, data } = signInSchema.safeParse(req.body)
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


        await handleRes(res, 200, { message: "Signed in successfully!", authToken })


    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})


userRouter.get("/me", authMiddleWare, async (req: authenticatedReq, res) => {
    try {
        const user = req.user

        await handleRes(res, 200, { messge: "User fetched successfully!", user })

    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})


userRouter.post("/onramp/inr", authMiddleWare, async (req: authenticatedReq, res) => {
    try {
        const { id: userId } = req.user as User
        const { success, error, data } = onrampSchema.safeParse(req.body)

        if (error) {
            const errors = error.issues.map((err) => {
                return { message: err.message }
            })
            await handleRes(res, 400, {}, errors)
            return;
        }

        let inrBalance = await prisma.inrBalance.create({
            data: {
                available: data?.amount,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        await handleRes(res, 200, inrBalance)
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})

export default userRouter;