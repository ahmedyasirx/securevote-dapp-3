export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black">Admin workflow</h1>
        <ol className="mt-6 list-decimal space-y-3 pl-6 text-slate-700">
          <li>Connect the wallet that deployed the SecureVote contract.</li>
          <li>Create an election with at least two candidates.</li>
          <li>Approve voter wallet addresses for that election.</li>
          <li>Set the election status from Draft to Active.</li>
          <li>After voting ends, set the status to Closed and present the on-chain result table.</li>
        </ol>
      </div>
    </main>
  );
}
