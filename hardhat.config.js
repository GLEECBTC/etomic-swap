require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-ignition-ethers");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const ETOMIC_SWAP_V1_CREATE2_SALT = process.env.ETOMIC_SWAP_V1_CREATE2_SALT;

if (!ETOMIC_SWAP_V1_CREATE2_SALT) {
  console.warn(
    "Warning: Missing ETOMIC_SWAP_V1_CREATE2_SALT. CREATE2 deployments (Ignition --strategy create2) will fail."
  );
}

const networkConfig = (chainId, rpcEnvVar, extra = {}) => ({
  url: process.env[rpcEnvVar] || "",
  accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
  chainId,
  ...extra,
});

// GLEEC mainnet's RPC sits behind Cloudflare bot protection that 503s requests
// without a browser-like User-Agent, so override the default Hardhat UA.
const GLEEC_HTTP_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
};

module.exports = {
  solidity: {
    version: "0.8.33",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
      // Pin EVM target to match the original Ethereum/Sepolia deployment bytecode.
      // Without this, solc 0.8.33 defaults to a newer target (PUSH0 etc.) and CREATE2
      // would produce a different address.
      evmVersion: "paris",
    },
  },

  ignition: {
    strategyConfig: {
      create2: {
        salt: ETOMIC_SWAP_V1_CREATE2_SALT,
      },
    },
  },

  networks: {
    // Local EVM (in-process)
    hardhat: {
      chainId: 1337,
    },

    // Local JSON-RPC node (e.g., `npx hardhat node`)
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : undefined,
    },

    // ============ TESTNETS (6) ============
    sepolia: networkConfig(11155111, "SEPOLIA_RPC_URL"),
    bscTestnet: networkConfig(97, "BSC_TESTNET_RPC_URL"),
    polygonMumbai: networkConfig(80001, "POLYGON_MUMBAI_RPC_URL"),
    avalancheFujiTestnet: networkConfig(43113, "AVALANCHE_TESTNET_RPC_URL"),
    ftmTestnet: networkConfig(4002, "FANTOM_TESTNET_RPC_URL"),
    gleecTestnet: networkConfig(11169, "GLEEC_TESTNET_RPC_URL", { httpHeaders: GLEEC_HTTP_HEADERS }),

    // ============ MAINNETS (19) ============
    mainnet: networkConfig(1, "MAINNET_RPC_URL"),
    bsc: networkConfig(56, "BSC_RPC_URL"),
    polygon: networkConfig(137, "POLYGON_RPC_URL"),
    avalanche: networkConfig(43114, "AVALANCHE_RPC_URL"),
    arbitrumOne: networkConfig(42161, "ARBITRUM_RPC_URL"),
    base: networkConfig(8453, "BASE_RPC_URL"),
    gnosis: networkConfig(100, "GNOSIS_RPC_URL"),
    kcc: networkConfig(321, "KCC_RPC_URL"),
    moonriver: networkConfig(1285, "MOONRIVER_RPC_URL"),
    moonbeam: networkConfig(1284, "MOONBEAM_RPC_URL"),
    opera: networkConfig(250, "FANTOM_RPC_URL"), // Fantom mainnet (named \"opera\" for verification compatibility)
    harmony: networkConfig(1666600000, "HARMONY_RPC_URL"),
    etc: networkConfig(61, "ETC_RPC_URL"),
    rsk: networkConfig(30, "RSK_RPC_URL"),
    ewc: networkConfig(246, "EWC_RPC_URL"),
    smartbch: networkConfig(10000, "SMARTBCH_RPC_URL"),
    ubiq: networkConfig(8, "UBIQ_RPC_URL"),
    qtum: networkConfig(3888, "QTUM_RPC_URL"), // Included for deployment only (no explorer verification config yet)
    gleec: networkConfig(11169, "GLEEC_RPC_URL", { httpHeaders: GLEEC_HTTP_HEADERS }), // Same chainId as gleecTestnet — chain migrated; testnet entry kept above for historical reference
  },

  etherscan: {
    // hardhat-verify needs per-network keys (object form) for customChains
    // entries to take effect. If apiKey is a single string, every network
    // is routed through the Etherscan V2 unified API and customChains is
    // ignored — which breaks Blockscout chains like KCC/EWC/GLEEC.
    //
    // For chains on Etherscan V2 (mainnet, bsc, polygon, avalanche, arbitrumOne,
    // base, gnosis, moonriver, moonbeam, opera, harmony, etc.), use the unified
    // ETHERSCAN_API_KEY. For Blockscout chains, any non-empty string works
    // (Blockscout does not require a key).
    apiKey: (() => {
      const v2 = process.env.ETHERSCAN_API_KEY;
      const blockscout = "no-key-needed";
      const keys = {};
      for (const n of [
        "mainnet", "sepolia",
        "bsc", "bscTestnet",
        "polygon", "polygonMumbai",
        "avalanche", "avalancheFujiTestnet",
        "arbitrumOne", "arbitrumSepolia",
        "base", "baseSepolia",
        "gnosis",
        "moonriver", "moonbeam",
        "opera", "ftmTestnet",
        "harmony",
      ]) keys[n] = v2;
      for (const n of ["kcc", "ewc", "gleec", "gleecTestnet"]) keys[n] = blockscout;
      return keys;
    })(),

    // For chains NOT in Etherscan V2, add customChains with their own explorer
    customChains: [
      {
        network: "kcc",
        chainId: 321,
        urls: {
          apiURL: "https://api.explorer.kcc.io/vipapi",
          browserURL: "https://explorer.kcc.io",
        },
      },
      {
        network: "ewc",
        chainId: 246,
        urls: {
          apiURL: "https://explorer.energyweb.org/api",
          browserURL: "https://explorer.energyweb.org",
        },
      },
      {
        network: "gleecTestnet",
        chainId: 11169,
        urls: {
          apiURL: "https://explorer.gleec.dev/api",
          browserURL: "https://explorer.gleec.dev",
        },
      },
      {
        network: "gleec",
        chainId: 11169,
        urls: {
          apiURL: "https://evm-explorer.gleec.com/api",
          browserURL: "https://evm-explorer.gleec.com",
        },
      },
    ],
  },
};
