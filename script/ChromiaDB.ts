import {
  createClient,
  IClient,
  SignatureProvider,
  Transaction,
} from "postchain-client";

interface ChromiaDBConfig {
  clientUrl: string;
  blockchainIid?: number;
  blockchainRid?: string;
  signatureProvider: SignatureProvider;
}

export class ChromiaDB {
  clientUrl: string | string[];
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
  }: {
    UID: number;
    messages: any;
    result: any;
    seed: number;
    model: string;
    provider: string;
  }) {
    return this.client.signAndSendUniqueTransaction(
      {
        name: "add_prompt_history",
        args: [UID, messages, result, seed, model, provider],
      },
      this.signatureProvider,
    );
  }

  async updatePromptHistory({
    promptId,
    result,
  }: {
    promptId: number;
    result: any;
  }) {
    return this.client.signAndSendUniqueTransaction(
      {
        name: "update_prompt_history",
        args: [promptId, result],
      },
      this.signatureProvider,
    );
  }

  async deletePromptHistory(promptId: number) {
    return this.client.signAndSendUniqueTransaction(
      {
        name: "delete_prompt_history",
        args: [promptId],
      },
      this.signatureProvider,
    );
  }

  async getPromptCount() {
    return this.client.query({
      name: "get_prompt_history_count",
      args: {},
    });
  }

  async changeOwner(oldOwner: SignatureProvider, newOwner: SignatureProvider) {
    let tx: Transaction = {
      operations: [
        {
          name: "change_owner",
          args: [newOwner.pubKey],
        },
      ],
      signers: [oldOwner.pubKey, newOwner.pubKey],
    };
    tx = this.client.addNop(tx);
    let signedTx = await this.client.signTransaction(tx, oldOwner);
    signedTx = await this.client.signTransaction(signedTx, newOwner);
    const result = await this.client.sendTransaction(signedTx);
    this.signatureProvider = newOwner;
    return result;
  }

  async batchDeletePromptHistories(startTime: number, endTime: number) {
    return this.client.signAndSendUniqueTransaction(
      {
        name: "batch_delete_prompt_histories",
        args: [startTime, endTime],
      },
      this.signatureProvider,
    );
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

  async getPromptHistories(
    startTime: number,
    endTime: number,
    pointer: number,
    nPrompts: number,
  ) {
    return this.client.query({
      name: "get_prompt_histories",
      args: {
        start_time: startTime,
        end_time: endTime,
        pointer: pointer,
        n_prompts: nPrompts,
      },
    });
  }

  async getPromptHistoriesByUID(UID: number, nPrompts: number, pointer = 0) {
    return this.client.query({
      name: "get_prompt_histories_by_uid",
      args: {
        UID: UID,
        n_prompts: nPrompts,
        pointer: pointer,
      },
    });
  }

  async getLatestPromptId() {
    return this.client.query({
      name: "latest_prompt_id",
    });
  }

  async getOwner() {
    const d = (await this.client.query({
      name: "get_owner",
      args: {},
    })) as any;
    return d?.toString("hex");
  }
}
