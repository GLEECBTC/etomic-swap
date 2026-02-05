# EtomicSwap V1 (SafeERC20) Deployments

## Deployed Address (all chains)

```
0x61EEC68Cf64d1b31e41EA713356De2563fB6D3F1
```

Same address on every EVM chain via deterministic CREATE2 deployment.

## Live Deployments

| Chain | Chain ID | TX Hash | Explorer |
|-------|----------|---------|----------|
| Ethereum | 1 | `0xd78d0b7138fb1657da3d61e4db664d08b85fbcbb92ebf457cc8e3fa1f4d45a5c` | [etherscan.io](https://etherscan.io/address/0x61EEC68Cf64d1b31e41EA713356De2563fB6D3F1#code) |
| Sepolia (testnet) | 11155111 | `0x0ce7879bdb6546e1a806bab1a8c09f990622bab69ae252cb79c5a04418a4150b` | [sepolia.etherscan.io](https://sepolia.etherscan.io/address/0x61EEC68Cf64d1b31e41EA713356De2563fB6D3F1#code) |

## Deployment Steps

The contract is deployed using [Hardhat Ignition](https://hardhat.org/ignition) with the CREATE2 strategy, which uses the [CreateX](https://github.com/pcaversaccio/createx) factory (`0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed`) to produce deterministic addresses across chains.

### Prerequisites

1. Copy `.env.example` to `.env` and fill in:
   - `DEPLOYER_PRIVATE_KEY` — the deployer wallet (`0x936c269a7378Ac408EF6EAB5770d29EA8EC6ecDd`)
   - `ETOMIC_SWAP_V1_CREATE2_SALT` — the mined salt (see below)
   - `ETHERSCAN_API_KEY` — for contract verification
   - The RPC URL env var for the target chain (e.g., `BSC_RPC_URL`)

2. Fund the deployer address with native gas on the target chain (~1.2M gas needed).

3. Install dependencies:
   ```bash
   yarn install
   ```

### Deploy to a new chain

```bash
npx hardhat ignition deploy ignition/modules/EtomicSwapV1.js --network <network-name> --strategy create2
```

Where `<network-name>` matches a key in `hardhat.config.js` `networks` (e.g., `bsc`, `polygon`, `avalanche`).

### Verify contract source

```bash
npx hardhat verify --network <network-name> 0x61EEC68Cf64d1b31e41EA713356De2563fB6D3F1
```

For chains using Etherscan V2, the single `ETHERSCAN_API_KEY` works. For chains with custom explorers (KCC, EWC), see `customChains` in `hardhat.config.js`.

### Adding a new chain

1. Add the network to `hardhat.config.js`:
   ```js
   newchain: networkConfig(<chainId>, "NEWCHAIN_RPC_URL"),
   ```
2. Add the RPC URL to `.env`
3. Verify that [CreateX is deployed](https://github.com/pcaversaccio/createx#deployments) on the target chain
4. Deploy and verify using the commands above
5. Update this file with the TX hash and explorer link

## Pending Deployments

| Chain | Chain ID | Network Name | RPC Env Var |
|-------|----------|--------------|-------------|
| BSC | 56 | `bsc` | `BSC_RPC_URL` |
| Polygon | 137 | `polygon` | `POLYGON_RPC_URL` |
| Avalanche | 43114 | `avalanche` | `AVALANCHE_RPC_URL` |
| Arbitrum One | 42161 | `arbitrumOne` | `ARBITRUM_RPC_URL` |
| Base | 8453 | `base` | `BASE_RPC_URL` |
| Fantom | 250 | `opera` | `FANTOM_RPC_URL` |
| Moonriver | 1285 | `moonriver` | `MOONRIVER_RPC_URL` |
| Moonbeam | 1284 | `moonbeam` | `MOONBEAM_RPC_URL` |
| KCC | 321 | `kcc` | `KCC_RPC_URL` |
| Harmony | 1666600000 | `harmony` | `HARMONY_RPC_URL` |
| ETC | 61 | `etc` | `ETC_RPC_URL` |
| RSK | 30 | `rsk` | `RSK_RPC_URL` |
| EWC | 246 | `ewc` | `EWC_RPC_URL` |
| SmartBCH | 10000 | `smartbch` | `SMARTBCH_RPC_URL` |
| Ubiq | 8 | `ubiq` | `UBIQ_RPC_URL` |
| Qtum | 3888 | `qtum` | `QTUM_RPC_URL` |

## Background

- **Contract**: `EtomicSwap.sol` with OpenZeppelin SafeERC20 (enables USDT and other non-standard ERC20 tokens)
- **Deployer**: `0x936c269a7378Ac408EF6EAB5770d29EA8EC6ecDd`
- **CreateX Factory**: [`0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed`](https://github.com/pcaversaccio/createx)
- **Salt**: `0x936c269a7378ac408ef6eab5770d29ea8ec6ecdd0050a3d70fd56cd902144e36`
  - Bytes 0-19: deployer address (permissioned salt)
  - Byte 20: `0x00` (cross-chain mode — same address on all chains)
  - Bytes 21-31: mined entropy via [createXcrunch](https://github.com/pcaversaccio/createx-crunch)
- **Previous V1 Contract** (no SafeERC20): `0x24ABE4c71FC658C91313b6552cd40cD808b3Ea80`
