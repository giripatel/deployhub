import { AWSError, S3 } from 'aws-sdk'
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

  console.log("From download 1");
  const allFiles = await s3.listObjectsV2({
    Bucket: bucket,
    Prefix: repo,
  }).promise();

  console.log("From download 2");
  const allPromises = allFiles.Contents?.map(async ({Key}) =>{
    console.log("From download 3");
    return new Promise((resolve) => {
      
      if(!Key) {
        resolve("");
        return;
      }
      console.log("From download 3");
      
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


