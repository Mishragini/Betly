import dotenv from "dotenv"
dotenv.config()

export const NODE_ENV = process.env.NODE_ENV || "development"
export const PORT = process.env.PORT || 3000
export const JWT_SECRET = process.env.JWT_SECRET || ""

export const AWS_REGION = process.env.AWS_REGION || ""
export const AWS_ACCESSKEYID = process.env.AWS_ACCESSKEYID || ""

export const AWS_SECRETACCESSKEY = process.env.AWS_SECRETACCESSKEY || ""
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || ""