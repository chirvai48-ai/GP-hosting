import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccess = process.env.SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccess) {
  throw new Error("Missing required AWS credentials in environment variables");
}

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccess,
  },
});

export const getUrl = async (bucket:string,key:string) => {
  const getUrl = await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }, // Valid for 1 hour
  );
  return getUrl
};

export const deleteObject = async (bucket: string, key: string): Promise<void> => {
  await S3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

export const putUrl = async (bucket:string,key:string,contentType:string) => {
  const putUrl = await getSignedUrl(
  S3,
  new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  }),
  { expiresIn: 3600 },
);
  return putUrl
};
