export function ProjectOverview() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-8 shadow-soft">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">SecureVote</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          SecureVote: A Blockchain-Based Electronic Voting System
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          A blockchain-based electronic voting system built on Ethereum, supporting election creation, voter authorisation, one-wallet-one-vote enforcement, transparent vote counting, and off-chain audit logging within a hybrid architecture.
        </p>
      </div>
    </section>
  );
}
