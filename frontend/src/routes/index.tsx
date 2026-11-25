import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Calculator, FlaskConical, Lamp, PenTool, Trophy, MapPin, Leaf } from "lucide-react";
import { productsQuery } from "@/services/productService";
import { ProductCard } from "@/components/products/ProductCard";
import { DevDataNote } from "@/components/common/DevDataNote";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Second Life — Discover campus treasures" },
      { name: "description", content: "Find affordable books, electronics, hostel essentials and academic resources shared by students across campus." },
      { property: "og:title", content: "Second Life — Discover campus treasures" },
      { property: "og:description", content: "Affordable second-hand campus essentials from fellow students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Home,
});

const CATEGORY_ICONS = [
  { name: "Stationery", icon: PenTool }, { name: "Academic Books", icon: BookOpen },
  { name: "Electronics", icon: Calculator }, { name: "Hostel Essentials", icon: Lamp },
  { name: "Lab Equipment", icon: FlaskConical }, { name: "Sports and Lifestyle", icon: Trophy },
] as const;

function Home() {
  const { data } = useSuspenseQuery(productsQuery());
  const recent = [...data].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 4);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <section className="map-texture relative overflow-hidden rounded-3xl border p-7 md:p-12">
        <p className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-forest shadow-card">
          <MapPin className="size-3.5 text-gold" /> Explore Campus Treasures
        </p>
        <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.1] text-deep md:text-6xl">
          Discover campus treasures. <span className="text-primary">Give them a second life.</span>
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
          Find affordable books, electronics, hostel essentials and academic resources shared by students across campus.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-forest">
            Explore Marketplace <ArrowRight className="size-4" />
          </Link>
          <Link to="/sell" className="inline-flex items-center gap-2 rounded-full border border-forest bg-card px-6 py-3 font-medium text-forest hover:bg-secondary">
            List an Item
          </Link>
        </div>
        <div className="trail absolute bottom-10 right-10 hidden h-1 w-64 md:block" />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Featured Category Kits</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_ICONS.map((c) => (
            <Link key={c.name} to="/marketplace" search={{ category: c.name }}
              className="group rounded-2xl border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary">
              <span className="grid size-11 place-items-center rounded-xl bg-map text-forest group-hover:bg-primary group-hover:text-primary-foreground">
                <c.icon className="size-5" />
              </span>
              <p className="mt-3 text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{data.filter((p) => p.category === c.name).length} finds</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <div><h2 className="text-2xl font-semibold">Recently Discovered</h2><DevDataNote /></div>
          <Link to="/marketplace" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl bg-deep p-7 text-deep-foreground">
          <Leaf className="size-6 text-gold" />
          <h3 className="mt-3 text-xl font-semibold">Every reuse counts</h3>
          <p className="mt-2 text-sm opacity-80">Sustainability statistics will appear here once the backend shares campus totals.</p>
        </div>
        <div className="rounded-3xl border bg-card p-7 shadow-card">
          <p className="text-xs font-medium uppercase tracking-widest text-gold-foreground">GREEN Credit Score</p>
          <h3 className="mt-2 text-xl font-semibold">New Member</h3>
          <p className="mt-2 text-sm text-muted-foreground">Complete your first verified exchange to start building your trust compass.</p>
        </div>
      </section>
    </div>
  );
}
