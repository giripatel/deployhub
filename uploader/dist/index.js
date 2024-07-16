"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const simple_git_1 = require("simple-git");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const aws_sdk_1 = require("aws-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    const baseDirectory = "/home/giridhar/web/projects/deployhub/clones";
    const git = (0, simple_git_1.simpleGit)(baseDirectory);
    const randomId = (0, uuid_1.v4)();
    const s3 = new aws_sdk_1.S3({
        endpoint: process.env.BUCKET_URL,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        signatureVersion: 'v4'
    });
    const clone = yield git
        .clone(url, randomId)
        .catch((reason) => {
        return reason;
    });
    if (clone instanceof simple_git_1.GitError) {
        console.log("Error");
        res.json({
            message: clone.message,
        });
        return;
    }
    const folders = fs_1.default.readdirSync(baseDirectory + "/" + randomId, {
        recursive: true,
        encoding: "utf-8",
    });
    const filesPath = folders.map((folder) => {
        return path_1.default.join(baseDirectory, randomId, folder);
    });
    filesPath.forEach(file => {
        console.log(file);
        // const fileData = fs.readFileSync(file,{encoding:"utf-8"})
        // console.log(fileData);
    });
    res.json({
        id: randomId,
    });
}));
app.listen(3000);
