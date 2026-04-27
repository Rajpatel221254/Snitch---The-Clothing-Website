import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import HomeProductCard from "../components/HomeProductCard.jsx";

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  const { handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    async function fetchData() {
      await handleGetAllProducts();
    }
    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0f0f0f] text-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* ── Hero Nav ── */}
      <nav className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <a
            href="/"
            className="text-2xl font-extrabold text-[#FFD700] tracking-[8px] uppercase no-underline"
          >
            Snitch
          </a>

          <div className="flex items-center gap-8">
            <a
              href="/products"
              className="hidden md:block text-[13px] text-white/40 hover:text-white/80 transition-colors uppercase tracking-[1.5px] no-underline"
            >
              Shop
            </a>
            <a
              href="/about"
              className="hidden md:block text-[13px] text-white/40 hover:text-white/80 transition-colors uppercase tracking-[1.5px] no-underline"
            >
              About
            </a>
            <a
              href="/contact"
              className="hidden md:block text-[13px] text-white/40 hover:text-white/80 transition-colors uppercase tracking-[1.5px] no-underline"
            >
              Contact
            </a>

            {/* Auth buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <span className="text-[12px] text-[#FFD700] uppercase tracking-[1.2px]">
                  {user.fullname}
                </span>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-[12px] text-white/50 hover:text-[#FFD700] transition-colors uppercase tracking-[1.2px] no-underline"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="px-5 py-2 bg-[#FFD700] hover:bg-[#e6c200] rounded-lg text-[12px] font-bold text-[#0f0f0f] uppercase tracking-[1.5px] transition-all duration-200 no-underline"
                  >
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFD700]/5 via-transparent to-transparent opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold tracking-[5px] text-[#FFD700]/60 uppercase mb-4">
              Premium Fashion
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Wear Confidence.
              <br />
              <span className="text-[#FFD700]">Own the Moment.</span>
            </h1>
            <p className="text-lg text-white/40 leading-relaxed mb-10 max-w-xl font-light">
              Discover curated collections that speak before you do. Crafted for
              the bold, designed for the fearless.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/products"
                className="px-8 py-4 bg-[#FFD700] hover:bg-[#e6c200] active:scale-[0.98] rounded-[10px] text-[13px] font-bold text-[#0f0f0f] uppercase tracking-[2px] transition-all duration-200 no-underline"
              >
                Explore Collection
              </a>
              <a
                href="/about"
                className="px-8 py-4 border border-[#2a2a2a] hover:border-[#FFD700]/40 rounded-[10px] text-[13px] font-semibold text-white/50 hover:text-[#FFD700] uppercase tracking-[1.5px] transition-all duration-200 no-underline"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#FFD700]/20 to-transparent" />
      </section>

      {/* ── Products Grid ── */}
      <section id="products" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-bold tracking-[4px] text-[#FFD700]/50 uppercase mb-3">
                Latest Drops
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                New Arrivals
              </h2>
            </div>
            <a
              href="/products"
              className="hidden md:block text-[12px] text-white/30 hover:text-[#FFD700] uppercase tracking-[1.5px] transition-colors no-underline"
            >
              View All →
            </a>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-72 bg-[#1a1a1a]" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-[#1a1a1a] rounded-full w-3/4" />
                    <div className="h-3 bg-[#1a1a1a] rounded-full w-full" />
                    <div className="h-3 bg-[#1a1a1a] rounded-full w-2/3" />
                    <div className="h-6 bg-[#1a1a1a] rounded-full w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && products?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#242424] flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
                    stroke="#FFD700"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 6H21"
                    stroke="#FFD700"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10"
                    stroke="#FFD700"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-lg text-white/40 mb-2">
                No products available yet
              </p>
              <p className="text-sm text-white/20">
                Check back soon for new arrivals
              </p>
            </div>
          )}

          {/* Product grid */}
          {!loading && products?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <HomeProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a1a1a] mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-extrabold text-[#FFD700] tracking-[6px] uppercase mb-2">
                Snitch
              </p>
              <p className="text-[11px] text-white/20 uppercase tracking-[2px]">
                Premium Fashion Est. 2020
              </p>
            </div>

            <div className="flex items-center gap-8">
              <a
                href="/privacy"
                className="text-[11px] text-white/25 hover:text-white/60 uppercase tracking-[1.2px] transition-colors no-underline"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-[11px] text-white/25 hover:text-white/60 uppercase tracking-[1.2px] transition-colors no-underline"
              >
                Terms
              </a>
              <a
                href="/contact"
                className="text-[11px] text-white/25 hover:text-white/60 uppercase tracking-[1.2px] transition-colors no-underline"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#1a1a1a]">
            <p className="text-[10px] text-white/15 text-center uppercase tracking-wider">
              © 2026 Snitch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
