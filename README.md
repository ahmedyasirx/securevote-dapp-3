# SecureVote DApp

## Project structure

- `contracts/SecureVote.sol` - main voting smart contract
- `scripts/deploy_secure_vote.ts` - deploy script
- `test/SecureVote.ts` - Hardhat tests
- `app/page.tsx` - main dashboard UI
- `app/api/audit/route.ts` - off-chain audit log endpoint
- `lib/contract.ts` - contract connection helpers

## Setup

1. Install packages

```bash
pnpm install
```

2. Copy the environment template

```bash
cp .env.example .env.local
```

3. Start a local chain

```bash
npx hardhat node
```

4. In a second terminal, deploy the contract

```bash
npx hardhat run scripts/deploy_secure_vote.ts --network localhost
```

5. Put the deployed address into `.env.local`

```env
NEXT_PUBLIC_SECUREVOTE_ADDRESS=0xYourDeployedContractAddressHere
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

6. Start the frontend

```bash
pnpm run dev
```

## Submission notes
- The original repository link (`https://github.com/jellydn/dapp-starter`) 
