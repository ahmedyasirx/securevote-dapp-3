"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPanel } from "@/app/components/AdminPanel";
import { ElectionCard } from "@/app/components/ElectionCard";
import { ProjectOverview } from "@/app/components/ProjectOverview";
import { SetupNotice } from "@/app/components/SetupNotice";
import { WalletBanner } from "@/app/components/WalletBanner";
import {
  contractAddress,
  fetchElections,
  getBrowserProvider,
  getReadOnlyContract,
  getSignerContract,
  hasConfiguredContract,
  requestWalletConnection
} from "@/lib/contract";
import { mockElections } from "@/lib/mock-data";
import type { AuditRecord, ElectionSummary } from "@/lib/types";
import { parseCandidateLines } from "@/lib/utils";

export default function HomePage() {
  const [elections, setElections] = useState<ElectionSummary[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState("Ready.");

  const isConfigured = useMemo(() => hasConfiguredContract(), []);
  const isOwner = walletAddress && ownerAddress && walletAddress.toLowerCase() === ownerAddress.toLowerCase();

  async function loadData() {
    try {
      if (!isConfigured) {
        setElections(mockElections);
        setMessage("Showing demo data until your contract address is configured.");
        return;
      }

      const contract = getReadOnlyContract();
      const [loadedElections, owner] = await Promise.all([fetchElections(), contract.owner()]);
      setOwnerAddress(owner);
      setElections(loadedElections);
      setMessage(loadedElections.length ? "Blockchain data loaded." : "Contract connected. Create your first election.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to load contract data.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const provider = getBrowserProvider();
    if (!provider) return;

    provider.listAccounts().then((accounts) => {
      if (accounts[0]) setWalletAddress(accounts[0]);
    });
  }, []);

  async function connectWallet() {
    setIsConnecting(true);
    try {
      const result = await requestWalletConnection();
      setWalletAddress(result.address);
      setMessage("Wallet connected. You can now submit transactions.");
      if (isConfigured) {
        const contract = getSignerContract(result.signer);
        setOwnerAddress(await contract.owner());
      }
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  }

  async function logAudit(record: AuditRecord) {
    try {
      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      });
    } catch (error) {
      console.error("Audit logging failed", error);
    }
  }

  async function withSigner(action: (contract: any) => Promise<void>) {
    if (!isConfigured) {
      throw new Error("Set NEXT_PUBLIC_SECUREVOTE_ADDRESS before sending transactions.");
    }

    const provider = getBrowserProvider();
    if (!provider) throw new Error("MetaMask is not available.");
    const signer = provider.getSigner();
    const contract = getSignerContract(signer);
    await action(contract);
  }

  async function handleCreateElection(form: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    candidates: string;
  }) {
    setIsBusy(true);
    try {
      const { names, manifestos } = parseCandidateLines(form.candidates);
      if (names.length < 2) throw new Error("Provide at least two candidates.");
      const start = Math.floor(new Date(form.startTime).getTime() / 1000);
      const end = Math.floor(new Date(form.endTime).getTime() / 1000);
      if (!start || !end || start >= end) throw new Error("Enter a valid start and end time.");

      await withSigner(async (contract) => {
        const tx = await contract.createElection(form.title, form.description, start, end, names, manifestos);
        await tx.wait();
      });

      await logAudit({
        timestamp: new Date().toISOString(),
        action: "create-election",
        wallet: walletAddress,
        details: { title: form.title, contractAddress }
      });
      setMessage("Election created successfully.");
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to create election.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleApproveVoter(form: { electionId: string; voter: string }) {
    setIsBusy(true);
    try {
      await withSigner(async (contract) => {
        const tx = await contract.approveVoter(Number(form.electionId), form.voter);
        await tx.wait();
      });

      await logAudit({
        timestamp: new Date().toISOString(),
        action: "approve-voter",
        wallet: walletAddress,
        electionId: Number(form.electionId),
        details: { voter: form.voter }
      });
      setMessage(`Approved ${form.voter} for election ${form.electionId}.`);
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to approve voter.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSetStatus(form: { electionId: string; status: string }) {
    setIsBusy(true);
    try {
      await withSigner(async (contract) => {
        const tx = await contract.setElectionStatus(Number(form.electionId), Number(form.status));
        await tx.wait();
      });

      await logAudit({
        timestamp: new Date().toISOString(),
        action: "update-status",
        wallet: walletAddress,
        electionId: Number(form.electionId),
        details: { status: Number(form.status) }
      });
      setMessage(`Election ${form.electionId} status updated.`);
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to update status.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleVote(electionId: number, candidateId: number) {
    setIsBusy(true);
    try {
      await withSigner(async (contract) => {
        const tx = await contract.castVote(electionId, candidateId);
        await tx.wait();
      });

      await logAudit({
        timestamp: new Date().toISOString(),
        action: "cast-vote",
        wallet: walletAddress,
        electionId,
        details: { candidateId }
      });
      setMessage(`Vote submitted for candidate ${candidateId} in election ${electionId}.`);
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Vote failed.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-6 lg:px-8">
      <ProjectOverview />
      <SetupNotice isConfigured={isConfigured} />
      <WalletBanner walletAddress={walletAddress} ownerAddress={ownerAddress} onConnect={connectWallet} isConnecting={isConnecting} />

      <div className="alert rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft">
        <span>{message}</span>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Architecture summary</h2>
            <p className="mt-2 text-slate-600">
              Frontend: Next.js. Smart contract: Solidity + Hardhat. Hybrid layer: local audit API for off-chain event tracking.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <div>Configured contract: {isConfigured ? contractAddress : "Not yet set"}</div>
            <div>Admin mode: {isOwner ? "Enabled" : "Disabled"}</div>
          </div>
        </div>
      </section>

      <AdminPanel disabled={!walletAddress || !isOwner || isBusy} onCreateElection={handleCreateElection} onApproveVoter={handleApproveVoter} onSetStatus={handleSetStatus} />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">Live elections</h2>
          <button className="btn rounded-2xl" onClick={loadData} disabled={isBusy}>
            Refresh
          </button>
        </div>

        <div className="card-grid">
          {elections.map((election) => (
            <ElectionCard key={election.id} election={election} onVote={handleVote} voteDisabled={!walletAddress || isBusy || !isConfigured} />
          ))}
        </div>
      </section>
    </main>
  );
}
