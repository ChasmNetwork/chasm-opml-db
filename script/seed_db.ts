import path from "path";
import fs from "fs";
import { chromiaClient } from "./client";

async function main() {
  // Setup Client
  const db = chromiaClient;
  await db.init();

  const a = (await db.getPromptHistories(
    1723911984848,
    Date.now(),
    0,
    20,
  )) as any;
  console.log("db:", a);

  // Add to DB
  // from https://orchestrator.chasm.net/scouts/prompts?page=1&pageSize=100
  console.time("addPromptHistory");
  let sample_data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./sample_data.json"), "utf-8"),
  ).data;
  sample_data = sample_data.slice(20, 30);
  const totalItems = sample_data.length;
  for (let i = 0; i < totalItems; i++) {
    console.log(`${i}/${totalItems}`);
    const prompt = format_data(sample_data[i]);
    const { status, statusCode, transactionRid } =
      await db.addPromptHistory(prompt);
  }
  console.timeEnd("addPromptHistory");

  // Query
  const res = (await db.getPromptHistories(
    Date.now() - 5 * 60 * 1000,
    Date.now(),
    0,
    20,
  )) as any;
  console.log("Count:", res.length);
  const latestPromptId = (await db.getLatestPromptId()) as number;
  console.log("Latest Prompt ID:", latestPromptId);
  // await db.deletePromptHistory(latestPromptId);
}

function format_json(data: any) {
  return JSON.stringify(data);
}

function format_data(data: any) {
  const UID = data.UID;
  const messages = format_json(data.messages);
  const result = format_json(data.result);
  const seed = data.seed;
  const model = data.result.scout.model;
  const provider = data.result.scout.provider;
  // const raw = format_json(data);

  return {
    UID,
    messages,
    result,
    seed,
    model,
    provider,
  };
}

main();
