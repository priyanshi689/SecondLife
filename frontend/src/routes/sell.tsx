import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, X, Sparkles, Info, CheckCircle2, Loader2, Timer } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, CONDITIONS, type Category, type Condition, type PriceSuggestion } from "@/lib/types";
import { requestSuggestedPrice } from "@/services/pricingService";
import { createListing } from "@/services/productService";
import { inr } from "@/components/products/ProductCard";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "List an Item — Second Life" },
      { name: "description", content: "List your item in under a minute and see a suggested fair price." },
      { property: "og:title", content: "List an Item — Second Life" },
      { property: "og:description", content: "Give your things a second life in under a minute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sell,
});

type Photo = { file: File; url: string };
const field = "w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

function Sell() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [drag, setDrag] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [condition, setCondition] = useState<Condition | "">("");
  const [age, setAge] = useState("");
  const [original, setOriginal] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [defects, setDefects] = useState("");
  const [suggestion, setSuggestion] = useState<PriceSuggestion | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 5 - photos.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotos((p) => [...p, ...next]);
  }

  useEffect(() => {
    if (!category || !condition || !age || !(+original > 0)) { setSuggestion(null); return; }
    setSuggesting(true);
    const t = setTimeout(() => {
      requestSuggestedPrice({ category, condition, ageMonths: +age, originalPrice: +original })
        .then(setSuggestion).finally(() => setSuggesting(false));
    }, 400);
    return () => clearTimeout(t);
  }, [category, condition, age, original]);

  function validate() {
    const e: Record<string, string> = {};
    if (!photos.length) e["photos"] = "Add at least one photo";
    if (name.trim().length < 3) e["name"] = "Give it a clear name";
    if (!category) e["category"] = "Pick a category";
    if (!condition) e["condition"] = "Pick a condition";
    if (age === "" || +age < 0) e["age"] = "How old is it?";
    if (!(+original > 0)) e["original"] = "Enter what you paid";
    if (!(+price > 0)) e["price"] = "Set your price";
    else if (+price > +original) e["price"] = "Selling price should be below original price";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function publish(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) { toast.error("A few details need attention"); return; }
    setPublishing(true);
    const fd = new FormData();
    Object.entries({ name, category, condition, ageMonths: age, originalPrice: original, sellingPrice: price, description, defects })
      .forEach(([k, v]) => fd.append(k, String(v)));
    photos.forEach((p) => fd.append("images", p.file));
    try {
      const r = await createListing(fd);
      setDone(true);
      toast.success(r.devOnly ? "Preview published (backend not connected yet)" : "Your listing is live!");
    } catch { toast.error("Couldn't publish. Please try again."); }
    finally { setPublishing(false); }
  }

  const Err = ({ k }: { k: string }) => errors[k] ? <p className="mt-1.5 text-xs text-destructive">{errors[k]}</p> : null;

  if (done) return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto size-14 text-emerald" />
      <h1 className="mt-4 text-3xl font-bold text-deep">It's on the map!</h1>
      <p className="mt-2 text-muted-foreground">{name} is ready to find its next owner.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/marketplace" className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">See marketplace</Link>
        <button onClick={() => window.location.reload()} className="rounded-full border bg-card px-6 py-3 font-medium">List another</button>
      </div>
    </div>
  );

  return (
    <form onSubmit={publish} noValidate className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <p className="inline-flex items-center gap-1.5 rounded-full bg-map px-3 py-1 text-xs font-medium text-forest"><Timer className="size-3.5 text-gold" /> Takes under a minute</p>
      <h1 className="mt-3 text-3xl font-bold text-deep md:text-4xl">Give it a second life</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <p className="font-display font-semibold">Photos <span className="text-xs font-normal text-muted-foreground">up to 5</span></p>
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              className={`mt-3 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? "border-primary bg-secondary" : "border-input hover:border-primary"}`}>
              <Camera className="size-8 text-forest" />
              <p className="mt-2 text-sm font-medium">Drop photos or tap to take / choose</p>
              <p className="text-xs text-muted-foreground">Bright, clear shots sell faster</p>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            </div>
            {photos.length > 0 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {photos.map((p, i) => (
                  <div key={p.url} className="relative aspect-square overflow-hidden rounded-lg border">
                    <img src={p.url} alt="" className="size-full object-cover" />
                    {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-gold px-1.5 text-[10px] font-semibold text-gold-foreground">Cover</span>}
                    <button type="button" aria-label="Remove photo" onClick={() => setPhotos((x) => x.filter((y) => y !== p))}
                      className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-card/90"><X className="size-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
            <Err k="photos" />
          </section>

          <section className="grid gap-4 rounded-2xl border bg-card p-5 shadow-card sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">What are you selling?</label>
              <input className={`${field} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Casio fx-991EX calculator" />
              <Err k="name" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Category</label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button type="button" key={c} onClick={() => setCategory(c)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm ${category === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{c}</button>
                ))}
              </div>
              <Err k="category" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Condition</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CONDITIONS.map((c) => (
                  <button type="button" key={c} onClick={() => setCondition(c)}
                    className={`rounded-xl border px-3 py-2.5 text-sm ${condition === c ? "border-primary bg-secondary font-medium text-forest" : "hover:border-primary"}`}>{c}</button>
                ))}
              </div>
              <Err k="condition" />
            </div>
            <div>
              <label className="text-sm font-medium">Age (months)</label>
              <input type="number" min={0} inputMode="numeric" className={`${field} mt-1.5`} value={age} onChange={(e) => setAge(e.target.value)} placeholder="12" />
              <Err k="age" />
            </div>
            <div>
              <label className="text-sm font-medium">Original price (₹)</label>
              <input type="number" min={1} inputMode="numeric" className={`${field} mt-1.5`} value={original} onChange={(e) => setOriginal(e.target.value)} placeholder="1500" />
              <Err k="original" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Description <span className="text-muted-foreground">(optional)</span></label>
              <textarea rows={3} className={`${field} mt-1.5`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Anything a junior should know?" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Known defects <span className="text-muted-foreground">(honesty builds trust)</span></label>
              <input className={`${field} mt-1.5`} value={defects} onChange={(e) => setDefects(e.target.value)} placeholder="e.g. small scratch on back" />
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <section className="map-texture overflow-hidden rounded-2xl border p-5">
            <p className="flex items-center gap-2 font-display font-semibold"><Sparkles className="size-4 text-gold" /> Fair Price Insight</p>
            {suggesting ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Checking the map…</p>
            ) : suggestion ? (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Suggested price</p>
                <p className="font-display text-4xl font-bold text-primary">{inr(suggestion.suggestedPrice)}</p>
                {suggestion.range && <p className="text-sm text-muted-foreground">Range {inr(suggestion.range.min)} – {inr(suggestion.range.max)}</p>}
                <ul className="mt-3 space-y-1 text-sm">{suggestion.factors?.map((f) => <li key={f} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-gold" />{f}</li>)}</ul>
                <button type="button" onClick={() => setPrice(String(suggestion.suggestedPrice))}
                  className="mt-4 w-full rounded-full border border-forest bg-card py-2 text-sm font-medium text-forest hover:bg-secondary">Use this price</button>
                {suggestion.illustrative && (
                  <p className="mt-3 flex gap-1.5 rounded-lg bg-card/80 p-2 text-[11px] text-muted-foreground"><Info className="size-3.5 shrink-0" />{suggestion.explanation}</p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Fill in category, condition, age and original price to see a suggestion.</p>
            )}
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <label className="text-sm font-medium">Your selling price (₹)</label>
            <input type="number" min={1} inputMode="numeric" className={`${field} mt-1.5 font-display text-2xl font-bold`} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
            <Err k="price" />
            {+price > 0 && +original > +price && (
              <p className="mt-2 text-sm text-forest">Buyer saves {inr(+original - +price)}</p>
            )}
            <button disabled={publishing} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-medium text-primary-foreground hover:bg-forest disabled:opacity-60">
              {publishing ? <><Loader2 className="size-4 animate-spin" /> Uploading…</> : "Publish listing"}
            </button>
          </section>
        </aside>
      </div>
    </form>
  );
}
