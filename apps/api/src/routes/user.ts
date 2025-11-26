import { Router } from "express";
import { signupSchema } from "../utils/validation";
import { getErrorMessage, handleRes } from "../utils/responseHandler";
import { prisma } from "@repo/db"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET, NODE_ENV } from "../utils/config";

const userRouter: Router = Router()

userRouter.post("/signup", async (req, res) => {
    try {
        const { success, data, error } = signupSchema.safeParse(req.body)
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

        res.cookie("auth-token", token,
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

export default userRouter;