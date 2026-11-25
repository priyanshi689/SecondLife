import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Compass } from "lucide-react";
import { productsQuery } from "@/services/productService";
import { ProductCard } from "@/components/products/ProductCard";
import { CATEGORIES, CONDITIONS, type Category } from "@/lib/types";
import { DevDataNote } from "@/components/common/DevDataNote";

type S = { category?: Category | undefined; q?: string | undefined };

export const Route = createFileRoute("/marketplace")({
  validateSearch: (s: Record<string, unknown>): S => ({
    category: CATEGORIES.includes(s["category"] as Category) ? (s["category"] as Category) : undefined,
    q: typeof s["q"] === "string" ? s["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore Marketplace — Second Life" },
      { name: "description", content: "Browse second-hand books, electronics, lab gear and hostel essentials from students on campus." },
      { property: "og:title", content: "Explore Marketplace — Second Life" },
      { property: "og:description", content: "Hidden gems from students across campus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Marketplace,
});

const SORTS = { newest: "Recently listed", low: "Price: low to high", high: "Price: high to low", savings: "Biggest savings" } as const;

function Marketplace() {
  const { data } = useSuspenseQuery(productsQuery());
  const { category, q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/marketplace" });
  const [maxPrice, setMaxPrice] = useState(5000);
  const [conds, setConds] = useState<string[]>([]);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [sort, setSort] = useState<keyof typeof SORTS>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    const r = data.filter((p) =>
      (!category || p.category === category) &&
      (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
      p.sellingPrice <= maxPrice && (!conds.length || conds.includes(p.condition)) && (!onlyAvail || p.available));
    return r.sort((a, b) =>
      sort === "low" ? a.sellingPrice - b.sellingPrice : sort === "high" ? b.sellingPrice - a.sellingPrice
      : sort === "savings" ? b.originalPrice - b.sellingPrice - (a.originalPrice - a.sellingPrice)
      : b.listedAt.localeCompare(a.listedAt));
  }, [data, category, q, maxPrice, conds, onlyAvail, sort]);

  const chip = (active: boolean) => `whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <div className="map-texture rounded-3xl border p-6 md:p-8">
        <p className="flex items-center gap-2 text-sm font-medium text-forest"><Compass className="size-4 text-gold" /> Hidden Gems</p>
        <h1 className="mt-2 text-3xl font-bold text-deep md:text-4xl">Explore the marketplace</h1>
        <div className="mt-5 flex max-w-xl items-center gap-2 rounded-full border bg-card px-4 py-3 shadow-card">
          <Search className="size-5 text-muted-foreground" />
          <input value={q} onChange={(e) => navigate({ search: (s) => ({ ...s, q: e.target.value || undefined }) })}
            placeholder="Calculator, lab coat, kettle…" className="flex-1 bg-transparent outline-none" />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button className={chip(!category)} onClick={() => navigate({ search: (s) => ({ ...s, category: undefined }) })}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} className={chip(category === c)} onClick={() => navigate({ search: (s) => ({ ...s, category: c }) })}>{c}</button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm text-muted-foreground">{list.length} treasures found</p><DevDataNote /></div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm lg:hidden">
            <SlidersHorizontal className="size-4" /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="rounded-full border bg-card px-4 py-2 text-sm">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} h-fit space-y-6 rounded-2xl border bg-card p-5 shadow-card lg:block`}>
          <div>
            <p className="text-sm font-semibold">Max price</p>
            <input type="range" min={100} max={5000} step={50} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-3 w-full accent-primary" />
            <p className="text-sm text-muted-foreground">Up to ₹{maxPrice.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Condition</p>
            {CONDITIONS.map((c) => (
              <label key={c} className="mt-2 flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-primary" checked={conds.includes(c)}
                  onChange={() => setConds((x) => x.includes(c) ? x.filter((y) => y !== c) : [...x, c])} /> {c}
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="accent-primary" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} /> Available only
          </label>
        </aside>

        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
            <Compass className="mx-auto size-10 text-gold" />
            <p className="mt-3 font-display font-semibold">No treasures on this path yet</p>
            <p className="text-sm text-muted-foreground">Try widening your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
