import { createClient } from "postchain-client";

(async () => {
  const client = await createClient({
    nodeUrlPool: [
      "https://dapps0.chromaway.com:7740",
      "https://chromia-mainnet.w3coins.io:7740",
      "https://mainnet-dapp1.sunube.net:7740",
      "https://chromia.01node.com:7740",
      "https://chromia-mainnet.caliber.build:443",
      "https://chromia.nocturnallabs.org:7740",
      "https://chromia2.stablelab.cloud:7740"
    ],
    blockchainRid:
      "BD8A4A23FD35BF0A711A8D65E94C06E651A286A412663A82AC2240416264C74D",
  });

  const d = (await client.query({
    name: "get_owner",
    args: {},
  })) as any;
  console.log(d?.toString("hex"));
})();
