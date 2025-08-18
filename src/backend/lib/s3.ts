import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region =
  process.env.AWS_S3_REGION || process.env.AWS_REGION || "us-east-1";
const accessKeyId =
  process.env.AWS_S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey =
  process.env.AWS_S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  region,
  credentials:
    accessKeyId && secretAccessKey
      ? {
          accessKeyId,
          secretAccessKey,
        }
      : undefined,
});

function buildPermanentS3Url(bucket: string, key: string): string {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  const r = (region || "").trim();
  if (r && r !== "us-east-1")
    return `https://${bucket}.s3.${r}.amazonaws.com/${encodedKey}`;
  return `https://${bucket}.s3.amazonaws.com/${encodedKey}`;
}

export async function getObjectUrl(key: string): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET as string;
  if (!bucket) throw new Error("AWS_S3_BUCKET not set");

  const publicBase = process.env.S3_PUBLIC_BASE_URL;
  if (publicBase && publicBase.trim()) {
    const base = publicBase.replace(/\/$/, "");
    const encodedKey = key.split("/").map(encodeURIComponent).join("/");
    return `${base}/${encodedKey}`;
  }

  if (process.env.S3_FORCE_PRESIGNED !== "true") {
    return buildPermanentS3Url(bucket, key);
  }

  const expiresIn = Number(process.env.S3_URL_EXPIRE) || 3600;
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3, cmd, { expiresIn });
}
