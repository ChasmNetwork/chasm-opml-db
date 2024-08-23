// https://docs.chromia.com/ft4/code-examples#complex-transactions
import dotenv from "dotenv";
import path from "path";
import { ChromiaDB } from "./ChromiaDB";
import { encryption, newSignatureProvider } from "postchain-client";

const ENV_PATH = path.join(__dirname, "../.chroma/chasm-test");
// file exist
const env = dotenv.config({
  path: ENV_PATH,
}).parsed!;

if (!env) {
  throw new Error(`.env file not found at ${ENV_PATH}`);
}

const privateKey =
  "2AC313A8384F319058C578F0E46A9871EACE285EA9144166D80FACE635713D39";

(async () => {
  const ownerKey = newSignatureProvider({ privKey: env.privkey });
  const db = new ChromiaDB({
    clientUrl: "http://localhost:7740",
    blockchainIid: 0,
    signatureProvider: ownerKey,
  });
  await db.init();
  const newAdmin = newSignatureProvider(encryption.makeKeyPair(privateKey));
  console.log("Current Owner: ", await db.getOwner());
  await db.changeOwner(ownerKey, newAdmin);
  console.log("Current Owner: ", await db.getOwner());
  await db.changeOwner(newAdmin, ownerKey);
  console.log("Current Owner: ", await db.getOwner());
})();
