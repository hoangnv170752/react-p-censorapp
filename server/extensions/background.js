import { Wallet } from './libs/wallet.js';

let walletInstance = null;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'CONNECT_WALLET') {
    walletInstance = new Wallet();
    await walletInstance.connect();
    sendResponse({ wallet: walletInstance.getWalletInfo() });
  }

  if (message.type === 'SEND_TRANSACTION') {
    const { to, amount } = message.payload;
    const txHash = await walletInstance.sendTransaction(to, amount);
    sendResponse({ txHash });
  }

  return true;
});