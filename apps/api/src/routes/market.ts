import { Router } from "express";
import { adminMiddleWare } from "../utils/middleware";
import { authenticatedReq, User } from "../utils/type";
import { getErrorMessage, handleRes } from "../utils/responseHandler";
import { createCategorySchema, createMarketSchema } from "../utils/validation";
import { prisma } from "@repo/db";
import { uploadFileToAws } from "../utils/awsClient";
import multer from "multer"
const upload = multer({})

export const marketRouter: Router = Router()

marketRouter.post("/create/category", adminMiddleWare, upload.single("categoryImg"), async (req: authenticatedReq, res) => {
    try {
        console.log(req.body)
        const { success, error, data } = createCategorySchema.safeParse(req.body)

        if (error) {
            const errors = error.issues.map((err) => {
                return { message: err.message }
            })
            await handleRes(res, 400, {}, errors)
            return
        }
        const file = req.file

        if (!file || !file.mimetype.startsWith('image')) {
            const error = {
                message: "Image file is required"
            }
            await handleRes(res, 400, {}, [error])
            return
        }

        console.log("file.....", file)
        const imageUrl = await uploadFileToAws(file.originalname, file.buffer)

        console.log("imageUrl....", imageUrl)


        const newCategory = await prisma.category.create({
            data: {
                name: data.name,
                imageUrl
            }
        })


        handleRes(res, 200, { message: "Category created successfully!", newCategory })

    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})

marketRouter.post("/create/market", adminMiddleWare, upload.single("marketImg"), async (req: authenticatedReq, res) => {
    try {
        const { id: userId } = req.user as User
        const { data, success, error } = createMarketSchema.safeParse(req.body)
        if (error) {
            const errors = error.issues.map((err) => {
                return { message: err.message }
            })
            await handleRes(res, 400, {}, errors)
            return;
        }

        const { title, description, sourceOfTruth, endDateTime, categoryId } = data

        const file = req.file

        if (!file || !file.mimetype.startsWith("image")) {
            const error = {
                message: "Image file is required"
            }
            await handleRes(res, 400, {}, [error])
            return
        }

        const imageUrl = await uploadFileToAws(file.originalname, file.buffer)

        const newMarket = await prisma.market.create({
            data: {
                title,
                description,
                sourceOfTruth,
                endDateTime,
                imageUrl,
                createdBy: {
                    connect: {
                        id: userId
                    }
                },
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        })

        await handleRes(res, 200, { message: "Market created successfully!", newMarket })
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        await handleRes(res, 500, {}, [{ message: errorMessage }])
    }
})