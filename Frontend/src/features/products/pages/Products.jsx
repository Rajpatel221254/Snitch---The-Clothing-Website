import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

function formatPrice(amount, currency) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount));
  } catch {
    return `${currency} ${amount}`;
  }
}

export default function Products() {
  const navigate = useNavigate();
  const { handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  // Filter and sort
  const displayedProducts = useMemo(() => {
    let filtered = [...(products || [])];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    // Price range
    if (priceRange !== "all") {
      filtered = filtered.filter((p) => {
        const price = Number(p.price?.amount || 0);
        if (priceRange === "under1000") return price < 1000;
        if (priceRange === "1000-2500") return price >= 1000 && price < 2500;
        if (priceRange === "2500-5000") return price >= 2500 && price < 5000;
        if (priceRange === "above5000") return price >= 5000;
        return true;
      });
    }

    // Sort
    if (sortBy === "price_low") {
      filtered.sort(
        (a, b) => Number(a.price?.amount || 0) - Number(b.price?.amount || 0),
      );
    } else if (sortBy === "price_high") {
      filtered.sort(
        (a, b) => Number(b.price?.amount || 0) - Number(a.price?.amount || 0),
      );
    } else if (sortBy === "name_asc") {
      filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return filtered;
  }, [products, search, sortBy, priceRange]);

  return (
    <div
      className="min-h-screen bg-[#0f0f0f] text-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      <div className="max-w-400 mx-auto px-6 lg:px-12 py-8">
        {/* ── Top Controls ── */}
        <div className="mb-8 space-y-4">
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-[#2a2a2a] rounded-[9px] text-[12px] text-white/40 hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all duration-200 uppercase tracking-wide"
            >
              ← Back to Home
            </button>
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5L21 21"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[10px] pl-12 pr-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#FFD700]/50 transition-all duration-200"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 2L14 14M14 2L2 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative sm:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[10px] px-4 py-3 pr-10 text-sm text-white outline-none cursor-pointer focus:border-[#FFD700]/50 transition-all duration-200"
              >
                <option value="featured">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M2 4L7 9L12 4"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Result count */}
          <p className="text-sm text-white/30">
            {displayedProducts.length} product
            {displayedProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* ── Main Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* LEFT — Price Filter */}
          <aside>
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-[14px] p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-[1.5px] mb-5">
                Price Range
              </h3>
              <div className="space-y-3">
                {[
                  { value: "all", label: "All Prices" },
                  { value: "under1000", label: "Under ₹1,000" },
                  { value: "1000-2500", label: "₹1,000 - ₹2,500" },
                  { value: "2500-5000", label: "₹2,500 - ₹5,000" },
                  { value: "above5000", label: "Above ₹5,000" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={priceRange === option.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                          priceRange === option.value
                            ? "border-[#FFD700] bg-[#FFD700]"
                            : "border-[#3a3a3a] bg-transparent group-hover:border-[#FFD700]/40"
                        }`}
                      >
                        {priceRange === option.value && (
                          <div className="w-2 h-2 bg-[#0f0f0f] rounded-full mx-auto mt-1.25" />
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm transition-colors duration-200 ${
                        priceRange === option.value
                          ? "text-white font-medium"
                          : "text-white/50 group-hover:text-white/70"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT — Product Grid */}
          <main>
            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#141414] border border-[#1e1e1e] rounded-[14px] overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-[#1a1a1a]" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-[#1a1a1a] rounded-full w-3/4" />
                      <div className="h-3 bg-[#1a1a1a] rounded-full w-full" />
                      <div className="h-6 bg-[#1a1a1a] rounded-full w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && displayedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#242424] flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="#FFD700"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M16.5 16.5L21 21"
                      stroke="#FFD700"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-lg text-white/50 mb-2">
                  {search.trim()
                    ? "No products match your search"
                    : "No products available"}
                </p>
                <p className="text-sm text-white/25 mb-6">
                  {search.trim()
                    ? "Try different keywords or adjust filters"
                    : "Check back later"}
                </p>
                {search.trim() && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="px-6 py-2.5 bg-[#FFD700] hover:bg-[#e6c200] rounded-[9px] text-[13px] font-semibold text-[#0f0f0f] uppercase tracking-[1px] transition-all duration-200 border-none cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Product grid */}
            {!loading && displayedProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedProducts.map((product) => {
                  const coverImage = product.images?.[0]?.url;
                  return (
                    <div
                      key={product._id}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="group bg-[#141414] border border-[#1e1e1e] rounded-[14px] overflow-hidden hover:border-[#FFD700]/30 transition-all duration-300 cursor-pointer hover:shadow-[0_8px_30px_rgba(255,215,0,0.1)]"
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-[#0e0e0e] overflow-hidden">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              opacity="0.1"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <circle
                                cx="8.5"
                                cy="8.5"
                                r="1.5"
                                fill="currentColor"
                              />
                              <path
                                d="M3 16L8 11L11 14L15 10L21 16"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Image count badge */}
                        {product.images?.length > 1 && (
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white/60 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
                            +{product.images.length - 1}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-[15px] font-medium text-white/85 mb-2 line-clamp-1 group-hover:text-[#FFD700] transition-colors duration-300">
                          {product.title}
                        </h3>
                        <p className="text-[13px] text-white/30 leading-relaxed line-clamp-2 mb-4">
                          {product.description}
                        </p>
                        <div className="text-xl font-bold text-[#FFD700] tracking-tight">
                          {formatPrice(
                            product.price?.amount,
                            product.price?.currency,
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
