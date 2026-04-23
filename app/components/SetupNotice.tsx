interface SetupNoticeProps {
  isConfigured: boolean;
}

export function SetupNotice({ isConfigured }: SetupNoticeProps) {
  return (
    <div className={`alert ${isConfigured ? "alert-success" : "alert-warning"} rounded-2xl`}>
      <span>
        {isConfigured
          ? "Contract address detected. The interface will read real blockchain data from your configured SecureVote deployment."
          : "No deployed contract address detected yet. The interface is showing seeded demo data until you deploy the contract and set NEXT_PUBLIC_SECUREVOTE_ADDRESS in .env.local."}
      </span>
    </div>
  );
}
