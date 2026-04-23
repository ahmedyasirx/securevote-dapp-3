interface ElectionPageProps {
  params: { id: string };
}

export default function ElectionPage({ params }: ElectionPageProps) {
  const { id } = params;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black">Election {id}</h1>
        <p className="mt-4 text-slate-700">
          The main dashboard already surfaces the full election state, candidates, and vote buttons. This route is left here
          so you can extend the project into a dedicated election details page if your tutor asks for a second iteration.
        </p>
      </div>
    </main>
  );
}
