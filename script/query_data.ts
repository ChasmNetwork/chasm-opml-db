import { chromiaClient } from "./client";

(async () => {
    await chromiaClient.init();

    const res = await chromiaClient.getPromptHistoriesByUID(6056, 20);
    console.log(JSON.stringify(res));
    const promptId = await chromiaClient.getLatestPromptId();
    console.log(promptId);
    const prompts = await chromiaClient.getPromptHistories(
        -1,
        Date.now(),
        20
    );
    console.log((prompts as any).map((d: any) => d.UID));
})()