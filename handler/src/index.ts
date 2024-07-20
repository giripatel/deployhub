import axios from 'axios';
import { S3 } from 'aws-sdk'
import express, { Request, Response } from 'express'
import dotenv from "dotenv"

const app = express();
dotenv.config()

const s3 = new S3({
    endpoint: process.env.BUCKET_URL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    signatureVersion: 'v4'
  });

app.get("/*", async (req: Request, res: Response) => {

    const host = req.hostname;
    const id = host.split(".")[0];

    const filePath = req.path;

    const file = await  s3.getObject({
      Bucket: 'deployhub',
      Key: `dist/${id}${filePath}`,
    }).promise()

    const type = filePath.endsWith('html')? 'text/html' : filePath.endsWith('css')? 'text/css' : 'text/javascript';

    res.set('Content-Type',type);

    res.send(file.Body)
})

app.listen(3001);