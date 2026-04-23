"use client";

import { truncateAddress } from "@/lib/utils";

interface WalletBannerProps {
  walletAddress: string;
  ownerAddress: string;
  onConnect: () => void;
  isConnecting: boolean;
}

export function WalletBanner({ walletAddress, ownerAddress, onConnect, isConnecting }: WalletBannerProps) {
  const connected = Boolean(walletAddress);
  const isOwner = connected && ownerAddress && walletAddress.toLowerCase() === ownerAddress.toLowerCase();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Wallet</p>
          <h2 className="mt-2 text-2xl font-semibold">{connected ? truncateAddress(walletAddress) : "Connect MetaMask to interact"}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {isOwner
              ? "This wallet is the contract owner, so admin actions are enabled."
              : "Student voters can connect a wallet, review candidates, and cast one on-chain vote."}
          </p>
        </div>
        <button className="btn btn-primary rounded-2xl" onClick={onConnect} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : connected ? "Reconnect Wallet" : "Connect MetaMask"}
        </button>
      </div>
    </div>
  );
}
