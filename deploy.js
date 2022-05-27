const ethers = require("ethers");
const fs = require("fs");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:7545"
  );
  const wallet = new ethers.Wallet(
    "2e0f8b4fa37460ca4c8ee4f7c4ffe925a31f025aedac56a60687a26ecde2c332",
    provider
  );
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait ...");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite Number: ${currentFavoriteNumber.toString()}`);
  const transactionResponse = await contract.store(7);
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite Number: ${updatedFavoriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
