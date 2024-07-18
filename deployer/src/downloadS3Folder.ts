import { AWSError, S3 } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request';
import axios from 'axios';
import dotenv from 'dotenv'
import fs from 'fs'
import path, { resolve } from 'path';
dotenv.config();

const s3 = new S3({
  endpoint: process.env.BUCKET_URL,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  signatureVersion: 'v4'
});

export async function downloadS3Folder(repo: any, bucket: string, downloadPath: string){

  const allFiles = await s3.listObjectsV2({
    Bucket: bucket,
    Prefix: repo
  }).promise();

  const allPromises = allFiles.Contents?.map(async ({Key}) =>{
    return new Promise(async (resolve) => {
      if(!Key) {
        resolve("");
        return;
      }

      const finalOutputPath = path.join(downloadPath, Key);
      const outputFile = fs.createWriteStream(finalOutputPath);
      const dirName = path.dirname(finalOutputPath);
      if(!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName,{recursive: true});
      }
      s3.getObject({
        Bucket: bucket,
        Key
      }).createReadStream().pipe(outputFile).on("finish", ()=> {
        resolve("");
      })
    })
  }) || []
  await Promise.all(allPromises?.filter(x=> x !== undefined));
}


