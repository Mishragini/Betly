import { S3Client, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_ACCESSKEYID, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRETACCESSKEY } from './config';

// Initialize an S3 client with provided credentials
const s3Client = new S3Client({
    region: AWS_REGION, // Specify the AWS region from environment variables
    credentials: {
        accessKeyId: AWS_ACCESSKEYID, // Access key ID from environment variables
        secretAccessKey: AWS_SECRETACCESSKEY // Secret access key from environment variables
    }
});

export const uploadFileToAws = async (fileName: string, file: Buffer<ArrayBufferLike>) => {

    // Configure the parameters for the S3 upload
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: file,
    };

    // Upload the file to S3
    await s3Client.send(new PutObjectCommand(uploadParams))



    const url = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`

    console.log("aws url....", url)

    return url;


};