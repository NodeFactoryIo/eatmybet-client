const transactionReceiptAsync = (web3, txHash, interval) => (
  new Promise((resolve, reject) =>
    web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
      if (error) {
        reject(error);
      } else if (receipt == null) {
        setTimeout(
          () => transactionReceiptAsync(web3, txHash, interval), interval);
      } else {
        resolve(receipt);
      }
    })
  )
);

export const getTransactionReceiptMined = (web3, txHash, interval = 500) => {
  if (Array.isArray(txHash)) {
    return Promise.all(txHash.map(
      oneTxHash => getTransactionReceiptMined(web3, oneTxHash, interval)));
  }

  else {
    if (typeof txHash === "string") {
      return transactionReceiptAsync(web3, txHash, interval);
    }
    else {
      throw new Error("Invalid Type: " + txHash);
    }
  }
};
