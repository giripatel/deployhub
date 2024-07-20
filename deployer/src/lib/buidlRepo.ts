import { rejects } from 'assert'
import { exec } from 'child_process'
import { resolve } from 'path'

export const buildRepo = async (repoPath: string) => {

   return new Promise( (resolve, reject) => {  
    const child = exec("npm install && npm run build",{cwd: repoPath})

    child.stdout?.on('data', function(data) {
        console.log("stdout: "+data);
    });

    child.stderr?.on('data', function(data) {
        console.error("stderr: " + data);
    });

    child.on('close', function(code) {
       resolve("")
    });
    })
}