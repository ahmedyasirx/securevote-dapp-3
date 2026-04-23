import { ethers } from "ethers";
import { secureVoteAbi } from "@/lib/abi";
import type { Candidate, ElectionSummary } from "@/lib/types";

export const contractAddress = process.env.NEXT_PUBLIC_SECUREVOTE_ADDRESS || "";
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545";

export function hasConfiguredContract() {
  return Boolean(contractAddress);
}

export function getReadOnlyProvider() {
  return new ethers.providers.JsonRpcProvider(rpcUrl);
}

export function getBrowserProvider() {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return null;
  }
  return new ethers.providers.Web3Provider((window as any).ethereum);
}

export async function requestWalletConnection() {
  const provider = getBrowserProvider();
  if (!provider) throw new Error("MetaMask is not available in this browser.");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return {
    provider,
    signer,
    address: await signer.getAddress()
  };
}

export function getReadOnlyContract() {
  return new ethers.Contract(contractAddress, secureVoteAbi, getReadOnlyProvider());
}

export function getSignerContract(signer: ethers.Signer) {
  return new ethers.Contract(contractAddress, secureVoteAbi, signer);
}

export function normaliseCandidate(candidate: any): Candidate {
  return {
    id: Number(candidate.id),
    name: candidate.name,
    manifesto: candidate.manifesto,
    voteCount: Number(candidate.voteCount)
  };
}

export function normaliseElection(election: any, candidates: Candidate[]): ElectionSummary {
  return {
    id: Number(election.id),
    title: election.title,
    description: election.description,
    startTime: Number(election.startTime),
    endTime: Number(election.endTime),
    status: Number(election.status) as 0 | 1 | 2,
    candidateCount: Number(election.candidateCount),
    totalVotes: Number(election.totalVotes),
    candidates
  };
}

export async function fetchElections() {
  const contract = getReadOnlyContract();
  const electionCount = Number(await contract.electionCount());
  const elections: ElectionSummary[] = [];

  for (let electionId = 1; electionId <= electionCount; electionId++) {
    const [election, rawCandidates] = await Promise.all([
      contract.getElection(electionId),
      contract.getCandidates(electionId)
    ]);

    const candidates = rawCandidates.map(normaliseCandidate);
    elections.push(normaliseElection(election, candidates));
  }

  return elections;
}
