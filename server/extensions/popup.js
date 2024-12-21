document.getElementById('connect-wallet').addEventListener('click', async () => {
  const wallet = await connectWallet();
  if (wallet) {
    document.getElementById('wallet-info').style.display = 'block';
    document.getElementById('wallet-address').textContent = wallet.address;
    document.getElementById('wallet-balance').textContent = wallet.balance + " ADA";
  } else {
    alert('Kết nối ví thất bại!');
  }
});

document.getElementById('send-transaction').addEventListener('click', async () => {
  const result = await sendTransaction('addr_test...', 10); // Gửi 10 ADA
  if (result) {
    alert('Giao dịch thành công! Tx Hash: ' + result);
  } else {
    alert('Giao dịch thất bại!');
  }
});

async function connectWallet() {
  // Gọi background.js để xử lý kết nối
  const response = await chrome.runtime.sendMessage({ type: 'CONNECT_WALLET' });
  return response.wallet;
}

async function sendTransaction(to, amount) {
  const response = await chrome.runtime.sendMessage({
    type: 'SEND_TRANSACTION',
    payload: { to, amount }
  });
  return response.txHash;
}