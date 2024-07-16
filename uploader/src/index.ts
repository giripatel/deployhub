import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { GitError, simpleGit } from "simple-git";
import fs from "fs";
import path from "path";
import { S3 } from "aws-sdk";
import dotenv from "dotenv"
import { getAllFiles } from "./lib";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.post("/deploy", async (req: Request, res: Response) => {

  const { url } = req.body;
  const baseDirectory = "/home/giridhar/web/projects/deployhub/clones";
  const git = simpleGit(baseDirectory);
  const randomId = uuidv4();

  const s3 = new S3({
    endpoint: process.env.BUCKET_URL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    signatureVersion: 'v4'
  });

  const clone: GitError | string = await git
    .clone(url, randomId)
    .catch((reason: any) => {
      return reason;
    });

  if (clone instanceof GitError) {
    console.log("Error");
    res.json({
      message: clone.message,
    });
    return;
  }

  const allFiles = getAllFiles(baseDirectory+"/"+randomId);

  allFiles.forEach( async (file) => {
    const fileData = fs.readFileSync(file,{encoding:"utf-8"})
   s3.upload({Bucket: "deployhub",Key: file.slice(baseDirectory.length + 1),Body: fileData},(err, data) =>{console.log("uploaded sucessfully");
   })
  })

  res.json({
    id: randomId,
  });
});

app.listen(3000);
