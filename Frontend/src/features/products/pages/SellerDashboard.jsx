import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import ProductCard from "../components/ProductCard.jsx";
import DashboardStats from "../components/DashboardStats.jsx";

/**
 * SellerDashboard
 *
 * Props:
 *   products   – array from your hook  (shape: [{ _id, title, description, price: { amount, currency }, images: [{ url, _id }], seller, createdAt }])
 *   loading    – boolean
 *   error      – string | null
 *   onDelete   – (productId: string) => Promise<void>
 *   onRefetch  – () => void
 */

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-[14px] overflow-hidden animate-pulse">
      <div className="h-52 bg-[#1e1e1e]" />
      <div className="p-4 space-y-3">
        <div className="h-3.5 bg-[#1e1e1e] rounded-full w-3/4" />
        <div className="h-2.5 bg-[#1e1e1e] rounded-full w-full" />
        <div className="h-2.5 bg-[#1e1e1e] rounded-full w-2/3" />
        <div className="h-6 bg-[#1e1e1e] rounded-full w-1/3 mt-1" />
        <div className="h-9 bg-[#1e1e1e] rounded-lg mt-2" />
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyState({ filtered }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28 gap-5">
      <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#242424] flex items-center justify-center">
        {filtered ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#FFD700" strokeWidth="1.8" />
            <path
              d="M16.5 16.5L21 21"
              stroke="#FFD700"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M8 11H14M11 8V14"
              stroke="#FFD700"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="3"
              stroke="#FFD700"
              strokeWidth="1.8"
            />
            <path
              d="M12 8V16M8 12H16"
              stroke="#FFD700"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <div className="text-center">
        <p className="text-[15px] font-semibold text-white/50 mb-1.5">
          {filtered ? "No products match your search" : "No products yet"}
        </p>
        <p className="text-[13px] text-white/22">
          {filtered
            ? "Try a different keyword or clear filters."
            : "Create your first listing and start selling."}
        </p>
      </div>
      {!filtered && (
        <a
          href="/seller/create-product"
          className="mt-1 px-7 py-3 bg-[#FFD700] hover:bg-[#e6c200] active:scale-[0.975] rounded-[10px] text-[13px] font-bold text-[#0f0f0f] uppercase tracking-[1.5px] transition-all duration-200 no-underline"
        >
          + Create Product
        </a>
      )}
    </div>
  );
}

/* ── Filter pill ── */
function Pill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[1px]
        border transition-all duration-200 cursor-pointer whitespace-nowrap
        ${
          active
            ? "bg-[#FFD700] border-[#FFD700] text-[#0f0f0f]"
            : "bg-transparent border-[#272727] text-white/30 hover:border-[#FFD700]/35 hover:text-white/55"
        }
      `}
    >
      {label}
    </button>
  );
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "price_low", label: "Price: Low to High" },
];

export default function SellerDashboard({
  products = [],
  loading = false,
  error = null,
  onDelete,
  onRefetch,
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  /* ── Derived list ── */
  const displayed = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sort === "newest")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sort === "oldest")
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sort === "price_high")
        return Number(b.price?.amount || 0) - Number(a.price?.amount || 0);
      if (sort === "price_low")
        return Number(a.price?.amount || 0) - Number(b.price?.amount || 0);
      return 0;
    });

    return list;
  }, [products, search, sort]);

  const isFiltered = search.trim().length > 0;

  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#0f0f0f] text-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-20 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-[#1a1a1a] px-5 md:px-10 py-4 flex items-center justify-between gap-4">
        <a
          href="/"
          className="text-xl font-extrabold text-[#FFD700] tracking-[6px] uppercase no-underline shrink-0"
        >
          Snitch
        </a>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/25 uppercase tracking-[1.5px]">
          <span>Seller</span>
          <span className="text-white/15">/</span>
          <span className="text-[#FFD700]">Dashboard</span>
        </div>

        {/* CTA */}
        <a
          href="/seller/create-product"
          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#FFD700] hover:bg-[#e6c200] active:scale-[0.975] rounded-[9px] text-[12px] font-bold text-[#0f0f0f] uppercase tracking-[1.5px] transition-all duration-200 no-underline"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1V11M1 6H11"
              stroke="#0f0f0f"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="hidden sm:inline">New Product</span>
          <span className="sm:hidden">New</span>
        </a>
      </nav>

      {/* ── Page content ── */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold tracking-[4px] text-[#FFD700]/55 uppercase mb-2">
            Seller Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
            My Products
          </h1>
          <p className="text-sm text-white/25 mt-2 font-light">
            Manage and track all your listed products.
          </p>
        </div>

        {/* ── Stats — only when data loaded ── */}
        {!loading && !error && products.length > 0 && (
          <DashboardStats products={products} />
        )}

        {/* ── Toolbar: search + sort ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
              />
              <path
                d="M16.5 16.5L21 21"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141414] border border-[#242424] rounded-[10px] pl-10 pr-4 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#FFD700]/50 focus:shadow-[0_0_0_3px_rgba(255,215,0,0.07)] transition-all duration-200"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 2L12 12M12 2L2 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-[#141414] border border-[#242424] rounded-[10px] px-4 py-2.5 pr-9 text-sm text-white/55 outline-none cursor-pointer focus:border-[#FFD700]/50 transition-all duration-200 w-full sm:w-auto"
            >
              {SORT_OPTIONS.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                  style={{ background: "#1a1a1a" }}
                >
                  {o.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 4L6 8L10 4"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Result count */}
        {!loading && !error && (
          <p className="text-[11px] text-white/20 mb-5 uppercase tracking-wide">
            {displayed.length} product{displayed.length !== 1 ? "s" : ""}
            {isFiltered && ` for "${search}"`}
          </p>
        )}

        {/* ── Error state ── */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#f87171"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 8V12M12 16H12.01"
                  stroke="#f87171"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-[14px] text-white/40 text-center">{error}</p>
            <button
              type="button"
              onClick={onRefetch}
              className="px-5 py-2.5 border border-[#2a2a2a] rounded-[9px] text-[12px] text-white/40 hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all duration-200 cursor-pointer bg-transparent uppercase tracking-wide"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Product grid ── */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : displayed.length === 0 ? (
              <EmptyState filtered={isFiltered} />
            ) : (
              displayed.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={onDelete}
                  onRefetch={onRefetch}
                  onclick={() => {
                    navigate(`/seller/product/${product._id}`);
                  }}
                  onEdit={(id) => navigate(`/seller/edit/${id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
