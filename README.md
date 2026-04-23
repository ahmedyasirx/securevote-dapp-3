# SecureVote DApp

SecureVote is a coursework-ready blockchain voting system rebuilt from the `jellydn/dapp-starter` foundation. The starter's stack uses **Next.js**, **Hardhat**, and **Ethers**, and this modified version turns that base into a full voting workflow with election creation, voter approval, one-wallet-one-vote enforcement, results display, and an off-chain audit log. 

## What changed from the starter

- Replaced the sample contract with `SecureVote.sol`
- Added a full election lifecycle: Draft -> Active -> Closed
- Added on-chain candidate storage and vote counting
- Added an admin panel for election creation, voter approval, and status updates
- Added a voter-facing dashboard with candidate cards and live tallies
- Added a local audit API route to support a hybrid architecture explanation in your report
- Added deployment script and Hardhat tests

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

## Demo flow for your presentation

1. Connect MetaMask
2. Show the admin wallet
3. Create an election with at least two candidates
4. Approve a voter address
5. Change the election status to `Active`
6. Connect with the approved voter wallet and cast a vote
7. Refresh the dashboard and show the result changing on-chain
8. Open `/api/audit` and show the off-chain audit records

## Submission notes

In your report/slides, include:
- Your public GitHub repository
- The original repository link (`https://github.com/jellydn/dapp-starter`)
- Your 10-minute presentation video link
- Screenshots of the dashboard, transaction flow, and test results

## Known limitation

This package was assembled offline in the workspace, so dependencies were not installed and the contract was not compiled here. Before submission, run the install, compile, test, and UI sanity check steps on your machine and adjust any environment-specific details if needed.
