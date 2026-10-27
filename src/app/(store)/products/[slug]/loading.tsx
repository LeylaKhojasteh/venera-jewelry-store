export default function ProductLoading() {
  return (
    <div className="shell section-tight" aria-busy="true" aria-live="polite">
      <div className="skeleton h-3 w-40" />
      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="skeleton aspect-[4/5] w-full" />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-10 w-2/3" />
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
      <p className="sr-only">در حال بارگذاری قطعه…</p>
    </div>
  );
}
