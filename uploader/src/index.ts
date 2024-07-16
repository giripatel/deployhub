import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { GitError, simpleGit } from "simple-git";
import fs from "fs";
import path from "path";
import { S3 } from "aws-sdk";
import dotenv from "dotenv"


const app = express();

dotenv.config()
app.use(express.json());

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

  const folders = fs.readdirSync(baseDirectory + "/" + randomId, {
    recursive: true,
    encoding: "utf-8",
  });
  const filesPath = folders.map((folder) => {
    return path.join(baseDirectory, randomId, folder);
  });

  filesPath.forEach(file => {
    console.log(file);
    
    // const fileData = fs.readFileSync(file,{encoding:"utf-8"})
    // console.log(fileData);
  })

  res.json({
    id: randomId,
  });
});

app.listen(3000);
