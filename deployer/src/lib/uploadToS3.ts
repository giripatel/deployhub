import { AWSError, S3 } from "aws-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path, { resolve } from "path";
import { getAllFiles } from "./getAllfiles";
dotenv.config();

const s3 = new S3({
  endpoint: process.env.BUCKET_URL,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

export const uploadToS3 = async (repoId: string) => {

  const baseDirectory = process.env.FOLDER_PATH || "";
  const folderPath =  path.join(baseDirectory, repoId, "dist");
  const allFiles = getAllFiles(folderPath);

  allFiles.forEach(async (file) => {

    return new Promise((resolve) => {
    const fileData =  fs.readFileSync(file, { encoding: "utf-8" });
    
    s3.upload(
      {
        Bucket: "deployhub",
        Key: `dist/${repoId}/${file.slice(folderPath.length + 1)}`,
        Body: fileData,
      },
      (err, data) => {
        console.log("uploaded sucessfully");
        resolve();
      }
    );
    })
  });

  await Promise.all(allFiles.filter(file => file !== undefined))
};
