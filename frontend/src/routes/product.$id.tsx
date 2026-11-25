import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeCheck, Heart, MessageCircle, Repeat, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import { productQuery } from "@/services/productService";
import { inr, savingsPct, TrustBadge } from "@/components/products/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.id));
    if (!p) throw notFound();
    return { name: p.name, price: p.sellingPrice };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Second Life` },
          { name: "description", content: `${loaderData.name} for ${inr(loaderData.price)} from a student on campus.` },
          { property: "og:title", content: `${loaderData.name} — Second Life` },
          { property: "og:description", content: `Available for ${inr(loaderData.price)} on Second Life.` },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Item unavailable — Second Life" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="p-12 text-center"><p className="font-display text-xl font-semibold">This treasure has moved on.</p>
      <Link to="/marketplace" className="mt-4 inline-block text-primary underline">Back to marketplace</Link></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(id));
  if (!p) return null;
  const pending = (what: string) => toast(`${what} will work once exchanges are connected.`);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Marketplace</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border bg-card shadow-card">
          <img src={p.images[0]} alt={p.name} width={816} height={816} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{p.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-deep md:text-4xl">{p.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-primary">{inr(p.sellingPrice)}</span>
            <span className="text-lg text-muted-foreground line-through">{inr(p.originalPrice)}</span>
            <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">Save {savingsPct(p)}%</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            {[["Condition", p.condition], ["Age", `${p.ageMonths} months`], ["Status", p.available ? "Available" : "Claimed"]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-secondary p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="font-medium">{v}</p></div>
            ))}
          </div>
          <p className="mt-6 leading-relaxed">{p.description}</p>
          {p.defects && (
            <div className="mt-4 flex gap-2 rounded-xl border border-gold bg-map p-3 text-sm"><AlertTriangle className="size-4 shrink-0 text-gold-foreground" /><span><b>Declared defects:</b> {p.defects}</span></div>
          )}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
            <span className="grid size-11 place-items-center rounded-full bg-map font-semibold text-forest">{p.seller.name[0]}</span>
            <div className="flex-1">
              <p className="flex items-center gap-1 font-medium">{p.seller.name} {p.seller.verified && <BadgeCheck className="size-4 text-emerald" />}</p>
              <p className="text-xs text-muted-foreground">{p.seller.year} · {p.seller.verified ? "Verified student" : "Not yet verified"}</p>
            </div>
            <TrustBadge seller={p.seller} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button disabled={!p.available} onClick={() => pending("Requesting items")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-forest disabled:opacity-50"><Repeat className="size-4" /> Request Item</button>
            <button onClick={() => pending("Messaging")} className="inline-flex items-center gap-2 rounded-full border bg-card px-5 py-3 font-medium"><MessageCircle className="size-4" /> Contact</button>
            <button aria-label="Favourite" className="grid size-12 place-items-center rounded-full border bg-card"><Heart className="size-5" /></button>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3.5" /> Handover is confirmed only after you inspect the item.</p>
        </div>
      </div>
    </div>
  );
}
