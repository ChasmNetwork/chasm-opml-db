import { chromiaClient } from "./client";

;(async () => {
  const db = chromiaClient;
  await db.init();
  console.log(await db.getOwner());
})();
