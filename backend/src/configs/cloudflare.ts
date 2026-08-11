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

// Signed URLs are valid for 1 hour; cache them for 55 minutes so the same
// object serves the same URL across requests (lets browsers/CDNs actually
// cache the image instead of re-fetching on a new signature every time).
const SIGNED_URL_TTL_MS = 55 * 60 * 1000;
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();

export const getUrl = async (bucket: string, key: string) => {
  const cacheKey = `${bucket}/${key}`;
  const cached = signedUrlCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const url = await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }, // Valid for 1 hour
  );

  signedUrlCache.set(cacheKey, { url, expiresAt: Date.now() + SIGNED_URL_TTL_MS });
  return url;
};

export const deleteObject = async (bucket: string, key: string): Promise<void> => {
  await S3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  signedUrlCache.delete(`${bucket}/${key}`);
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
