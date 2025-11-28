import * as z from "zod";

export const signUpSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain uppercase, lowercase, number, and special character"),
    role: z.enum(["user", "admin"])
})

export const signInSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain uppercase, lowercase, number, and special character")
})

export const onrampSchema = z.object({
    amount: z.string()
        .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid decimal with up to 2 decimal places")
        .transform((val) => {
            const [rupees, paise = "0"] = val.split(".")
            const normalisedPaise = paise.padEnd(2, "0")
            return parseInt(rupees) * 100 + parseInt(normalisedPaise)
        })
})

export const createCategorySchema = z.object({
    name: z.string()
})

export const createMarketSchema = z.object({
    title: z.string(),
    description: z.string(),
    sourceOfTruth: z.url(),
    endDateTime: z.string(),
    categoryId: z.string()
})