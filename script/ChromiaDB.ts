import { createClient, IClient, SignatureProvider } from "postchain-client";

interface ChromiaDBConfig {
  clientUrl: string;
  blockchainIid?: number;
  blockchainRid?: string;
  signatureProvider: SignatureProvider;
}

export class ChromiaDB {
  clientUrl: string;
  blockchainIid?: number;
  blockchainRid?: string;
  client: IClient;
  signatureProvider: SignatureProvider;

  constructor({
    clientUrl,
    blockchainRid,
    blockchainIid,
    signatureProvider,
  }: ChromiaDBConfig) {
    this.clientUrl = clientUrl;
    this.blockchainRid = blockchainRid;
    this.blockchainIid = blockchainIid;
    this.signatureProvider = signatureProvider;
    this.client = {} as IClient;
  }

  async init() {
    if (this.blockchainRid !== undefined) {
      this.client = await createClient({
        nodeUrlPool: this.clientUrl,
        blockchainRid: this.blockchainRid,
      });
    } else if (this.blockchainIid !== undefined) {
      this.client = await createClient({
        nodeUrlPool: this.clientUrl,
        blockchainIid: this.blockchainIid,
      });
    } else {
      throw new Error("No blockchain identifier provided");
    }
  }

  // Operation
  async addPromptHistory({
    UID,
    messages,
    result,
    seed,
    model,
    provider,
    raw,
  }: {
    UID: number;
    messages: any;
    result: any;
    seed: number;
    model: string;
    provider: string;
    raw: any;
  }) {
    return this.client.signAndSendUniqueTransaction(
      {
        name: "add_prompt_history",
        args: [UID, messages, result, seed, model, provider, raw],
      },
      this.signatureProvider
    );
  }

  async updatePromptHistory({
    promptId,
    result,
    raw,
  }: {
    promptId: number;
    result: any;
    raw: any;
  }) {
    return this.client.signAndSendUniqueTransaction(
      {
        name: "update_prompt_history",
        args: [promptId, result, raw],
      },
      this.signatureProvider
    );
  }

  async deletePromptHistory(promptId: number) {
    return this.client.signAndSendUniqueTransaction(
        {
            name: "delete_prompt_history",
            args: [promptId],
        },
        this.signatureProvider
    )
  }

  async changeOwner(oldOwner: SignatureProvider, newOwner: SignatureProvider) {
    let tx = await this.client.signTransaction({
      operations: [
        {
          name: "change_owner",
          args: [newOwner.pubKey],
        },
      ],
      signers: [oldOwner.pubKey, newOwner.pubKey],
    }, oldOwner);
    tx = await this.client.signTransaction(tx, newOwner);
    const result = await this.client.sendTransaction(tx);
    this.signatureProvider = newOwner;
    return result;
  }

  // Query
  async getPromptHistory(promptId: number) {
    return this.client.query({
      name: "get_prompt_history",
      args: {
        prompt_id: promptId,
      },
    });
  }

  async getPromptHistories(startTime: number, endTime: number, nPrompts: number) {
    return this.client.query({
      name: "get_prompt_histories",
      args: {
        start_time: startTime,
        end_time: endTime,
        n_prompts: nPrompts,
      },
    });
  }

  async getLatestPromptId() {
    return this.client.query({
        name: "latest_prompt_id"
    })
  }

  async getOwner() {
    const d = await this.client.query({
      name: "get_owner",
      args: {},
    }) as any;
    return d?.toString("hex");
  }
}
