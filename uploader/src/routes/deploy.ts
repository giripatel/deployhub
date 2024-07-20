import { Request, Router, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { GitError, simpleGit } from "simple-git";
import fs from "fs";
import { S3 } from "aws-sdk";
import { getAllFiles } from "../lib";
import { createClient } from 'redis'

export const deployRouter =  Router();

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

deployRouter.post("/deploy", async (req: Request, res: Response) => {

  const { url } = req.body;
  const baseDirectory = "/home/giridhar/web/projects/deployhub/repos/clones";
  const git = simpleGit(baseDirectory);
  const repoId = uuidv4();

  const redisUrl = process.env.REDIS_URL || ""
  const s3 = new S3({
    endpoint: process.env.BUCKET_URL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    signatureVersion: 'v4'
  });

  // const clone: GitError | string = await git
  //   .clone(url, repoId)
  //   .catch((reason: any) => {
  //     return reason;
  //   });

  // if (clone instanceof GitError) {
  //   console.log("Error");
  //   res.json({
  //     message: clone.message,
  //   });
  //   return;
  // }

  // const allFiles = getAllFiles(baseDirectory+"/"+repoId);

  // allFiles.forEach( async (file) => {
  //   const fileData = fs.readFileSync(file,{encoding:"utf-8"})
  //  s3.upload({Bucket: "deployhub",Key: `clones/${file.slice(baseDirectory.length + 1)}`,Body: fileData},(err, data) =>{console.log("uploaded sucessfully");
  //  })
  // })


  await publisher.lPush("build-queue",repoId);
  await publisher.hSet("status",repoId,"uploaded");

  res.json({
    // id: repoId,
    id: "04a01c45-b423-4554-ab27-18bcbdd0e2ec",
  });
});


deployRouter.get("/deploy/status", async (req:Request , res: Response) =>{

    const {id} = req.query;
    console.log(id)
    const status = await subscriber.hGet("status", id as string)

    const url = `http://${id}.deployhub.com:3001/index.html`

    res.json({
      status,
      url
    })


})