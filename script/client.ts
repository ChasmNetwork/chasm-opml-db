import fs from "fs";
import path from "path";
import os from "os";
import dotenv from "dotenv";
import { newSignatureProvider } from "postchain-client";
import { ChromiaDB } from "./ChromiaDB";

// Local
const ENV_PATH = path.join(__dirname, "../.chroma/chasm-test");
const env = dotenv.config({
    path: ENV_PATH,
  }).parsed!;
export const localClient = new ChromiaDB({
    clientUrl: "http://localhost:7740",
    blockchainIid: 0,
    signatureProvider: newSignatureProvider({privKey: env.privkey})
})

// Production
const filePath = path.join(os.homedir(), '.chromia/chasm-production');
const pk = fs.readFileSync(filePath, "utf-8");
const signatureProvider = newSignatureProvider({ privKey: pk });
export const productionClient = new ChromiaDB({
    clientUrl: "https://dapps0.chromaway.com:7740",
    blockchainRid: "BD8A4A23FD35BF0A711A8D65E94C06E651A286A412663A82AC2240416264C74D",
    signatureProvider,
  });

// Change this to switch between local and production
export const chromiaClient = productionClient;