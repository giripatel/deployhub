import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./downloadS3Folder";
import dotenv from 'dotenv'

dotenv.config();
const subscriber = createClient();
subscriber.connect();
async function poll(){

    const bucket = process.env.BUCKET || "";
    const downloadPath = process.env.DOWNLOAD_PATH || "";

    while (1) {
        
        const response = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        );
        console.log(response);
        downloadS3Folder('38cf8cd1-c4bb-4347-a471-4741ef4783ae', bucket, downloadPath);
    }
      
}

poll();