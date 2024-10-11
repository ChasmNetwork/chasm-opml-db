import { chromiaClient } from "./client";

(async () => {
  await chromiaClient.init();

  const res = await chromiaClient.getPromptHistory(6);
  console.log(res);
  // const histories = await chromiaClient.getPromptHistories(
  //   Date.now() - 7 * 60 * 1000,
  //   Date.now(),
  //   1,
  //   20,
  // );
  // console.log(histories);
  // console.log("Pointer: ", (histories as any).pointer);
  // console.log("Length: ", (histories as any).prompts.length);
  // const res = await chromiaClient.getPromptCount()
  // console.log(res)
  // const res = await chromiaClient.getPromptHistoriesByUID(6, 20);
  // console.log(JSON.stringify(res));
  // const promptId = await chromiaClient.getLatestPromptId();
  // console.log(promptId);
  // const prompts = await chromiaClient.getPromptHistories(-1, Date.now(), 20);
  // console.log((prompts as any).map((d: any) => d.prompt_id));
  // await chromiaClient.updatePromptHistory({
  //   promptId: 6,
  //   result:
  //     '{"id":"chatcmpl-97198e3f-ee1c-4715-92ce-d774d605a859","model":"gemma2-9b-it","scout":{"model":"gemma2-9b-it","provider":"groq"},"object":"chat.completion","x_groq":{"id":"req_01j5qbg78qes8sjanx6pkx36tm","usage":{"queue_time":0.019168049,"total_time":0.52845846,"prompt_time":0.004193308,"total_tokens":324,"prompt_tokens":71,"completion_time":0.524265152,"completion_tokens":253}},"choices":[{"index":0,"message":{"role":"assistant","content":"The Genesis Tree, as it was dubbed, stood defiant against the smog-choked sky. Its genetically engineered leaves, a vibrant emerald green, pulsed with an almost unnatural energy as they greedily devoured the carbon dioxide that choked the air.  Born from the desperation of a dying planet, it became a beacon of hope in a world drowning in its own waste.  \\n\\nPeople flocked to its base, seeking solace in its presence. Children climbed its sturdy branches, their laughter echoing through the polluted air, a stark contrast to the coughs and wheezes that once defined the city.  Artists painted its majestic form, poets penned sonnets to its resilience, and scientists studied its secrets, hoping to replicate its miracle.\\n\\nBut the Genesis Tree was more than just a symbol; it was a weapon.  A weapon against the corporations that had fueled the planet\'s destruction, against the apathy that had allowed it to happen.  It was a testament to the power of nature, a reminder that even in the face of overwhelming odds, life could find a way to thrive.  And in its emerald embrace, people found the courage to resist, to fight for a future where clean air and green spaces were not a luxury, but a right. \\n\\n\\n"},"logprobs":null,"finish_reason":"stop"}],"created":1724139446,"system_fingerprint":"fp_10c08bf97d"}',
  // });
})();
