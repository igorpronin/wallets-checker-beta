const ethers = require('ethers');
const cron = require('node-cron');

// ABI for ERC20 token balance function
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

// Replace with your Infura project ID or other provider URL
const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth');

function getCurrentDateTime() {
  return new Date().toLocaleString();
}

async function getEthBalance(address) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

async function getTokenBalance(tokenAddress, walletAddress) {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const balance = await contract.balanceOf(walletAddress);
  const decimals = await contract.decimals();
  return ethers.formatUnits(balance, decimals);
}

async function checkWallet(walletAddress) {
  try {
    // console.log(`\n[${getCurrentDateTime()}] Checking wallet balance...`);
    
    // const ethBalance = await getEthBalance(walletAddress);
    // console.log(`ETH Balance: ${ethBalance} ETH`);

    // Add addresses of tokens you want to check
    const tokenAddresses = {
      'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      // Add more tokens as needed
    };

    for (const [tokenName, tokenAddress] of Object.entries(tokenAddresses)) {
      const tokenBalance = await getTokenBalance(tokenAddress, walletAddress);
      console.log(`[${getCurrentDateTime()}] ${tokenName} Balance: ${tokenBalance} ${tokenName}`);
    }
  } catch (error) {
    console.error('Error checking wallet:', error);
  }
}

// Replace with the wallet address you want to check
const walletToCheck = '0x2F1f7FC76e6CF5ab3e186A2A2FD4Fc31952a77Cc';

// Schedule the task to run every 10 minutes
cron.schedule('*/10 * * * *', () => {
  checkWallet(walletToCheck);
});

// Initial check when the script starts
// console.log(`[${getCurrentDateTime()}] Starting wallet checker...`);
checkWallet(walletToCheck);