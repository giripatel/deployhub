import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./lib/downloadS3Folder";
import dotenv from 'dotenv'
import { buildRepo } from "./lib/buidlRepo";
import path from "path";
import { uploadToS3 } from "./lib/uploadToS3";
import { getAllFiles } from "./lib/getAllfiles";

dotenv.config();
const subscriber = createClient();
subscriber.connect();
async function poll(){

    const bucket = process.env.BUCKET || "";
    const downloadPath = process.env.DOWNLOAD_PATH || "";
    const folderPath = process.env.FOLDER_PATH || "";

    while (1) {
        
        const response = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        );

        console.log(response);
        if (!response?.element) {
            return;
        }
        
        // await downloadS3Folder(`clones/${"04a01c45-b423-4554-ab27-18bcbdd0e2ec"}`, bucket, downloadPath);
        // await buildRepo(path.join(folderPath,"04a01c45-b423-4554-ab27-18bcbdd0e2ec"));
        // await uploadToS3("04a01c45-b423-4554-ab27-18bcbdd0e2ec");

        await new Promise((resolve) => setTimeout(() => {
            resolve("")
        }, 10000))
        console.log("deployed");
        
        subscriber.hSet("status", "04a01c45-b423-4554-ab27-18bcbdd0e2ec", "deployed")

    }
      
}

poll();