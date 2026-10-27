export default function ProductsLoading() {
  return (
    <div className="shell section-tight" aria-busy="true" aria-live="polite">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton mt-5 h-10 w-72 max-w-full" />
      <div className="skeleton mt-3 h-4 w-96 max-w-full" />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="hidden lg:col-span-3 lg:block">
          <div className="skeleton h-64 w-full" />
        </div>
        <div className="lg:col-span-9">
          <div className="skeleton h-11 w-full" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="skeleton aspect-[4/5] w-full" />
                <div className="skeleton mt-4 h-3 w-2/3" />
                <div className="skeleton mt-2 h-3 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only">در حال بارگذاری محصولات…</p>
    </div>
  );
}
