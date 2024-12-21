import { Lucid, Blockfrost } from 'lucid-cardano';

export class Wallet {
  constructor() {
    this.lucid = null;
    this.wallet = null;
  }

  async connect() {
    this.lucid = await Lucid.new(
      new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "previewj1aWQ19dReBNJoCTq9zzw4UkqGYiu7eN"),
      "Preprod"
    );
    this.wallet = await this.lucid.selectWallet();
  }

  getWalletInfo() {
    return {
      address: this.wallet.address,
      balance: this.wallet.balance, 
    };
  }

  async sendTransaction(to, amount) {
    const tx = await this.lucid.newTx()
      .payToAddress(to, { lovelace: BigInt(amount * 1000000) }) // Gửi ADA
      .complete();

    const signedTx = await tx.sign().complete();
    return await signedTx.submit();
  }
}