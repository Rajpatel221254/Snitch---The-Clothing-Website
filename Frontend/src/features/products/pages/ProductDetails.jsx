import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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
 
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProduct } = useProduct();
 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
 
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await handleGetProduct(id);
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
 
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
          <p className="text-xs text-white/30 uppercase tracking-widest">Loading product...</p>
        </div>
      </div>
    );
  }
 
  if (error || !product) {
    return (
      <div
        className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#f87171" strokeWidth="1.8" />
              <path d="M12 8V12M12 16H12.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-white/50 text-sm mb-5">{error || "Product not found"}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2.5 border border-[#2a2a2a] rounded-[8px] text-[11px] text-white/40 hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all uppercase tracking-wide"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }
 
  const images = product.images || [];
  const currentImage = images[selectedImage]?.url || null;
 
  return (
    <div
      className="min-h-screen bg-[#0f0f0f] text-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>
 
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <a href="/" className="text-lg font-extrabold text-[#FFD700] tracking-[8px] uppercase no-underline">
            Snitch
          </a>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-[11px] text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest"
          >
            ← Back to Shop
          </button>
        </div>
      </nav>
 
      {/* ── Product Detail ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
 
          {/* LEFT — Image Gallery (compact) */}
          <div className="space-y-3">
            {/* Main image — 3:2 ratio instead of 4:5 */}
            <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden"
              style={{ aspectRatio: "3/2" }}>
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 15L8 10L11 13L15 9L21 15" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
            </div>
 
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img._id || i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer
                      ${i === selectedImage
                        ? "border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                        : "border-[#1a1a1a] hover:border-[#2a2a2a]"
                      }`}
                  >
                    <img src={img.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
 
          {/* RIGHT — Product Info */}
          <div className="flex flex-col gap-5">
 
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-widest">
              <a href="/" className="hover:text-white/40 transition-colors no-underline">Home</a>
              <span>/</span>
              <span className="text-[#FFD700]">Product</span>
            </div>
 
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {product.title}
            </h1>
 
            {/* Price */}
            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">Price</p>
              <p className="text-2xl font-extrabold text-[#FFD700] tracking-tight">
                {formatPrice(product.price?.amount, product.price?.currency)}
              </p>
            </div>
 
            {/* Description */}
            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Description</p>
              <p className="text-sm text-white/50 leading-relaxed">{product.description}</p>
            </div>
 
            {/* Product ID */}
            <div className="pb-5 border-b border-[#1a1a1a]">
              <p className="text-[9px] text-white/15 uppercase tracking-widest mb-1">Product ID</p>
              <p className="text-[11px] text-white/20 font-mono">{product._id}</p>
            </div>
 
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex-1 px-6 py-3 bg-[#FFD700] hover:bg-[#e6c200] active:scale-[0.98] rounded-[9px] text-[12px] font-bold text-[#0f0f0f] uppercase tracking-[1.5px] transition-all duration-200 border-none cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="flex-1 px-6 py-3 border border-[#2a2a2a] hover:border-[#FFD700]/40 rounded-[9px] text-[12px] font-semibold text-white/50 hover:text-[#FFD700] uppercase tracking-[1.2px] transition-all duration-200 cursor-pointer bg-transparent"
              >
                Add to Wishlist
              </button>
            </div>
 
            {/* Additional info */}
            <div className="pt-5 border-t border-[#1a1a1a] space-y-3">
              {[
                {
                  title: "Authenticity Guaranteed",
                  sub: "100% original products, verified by Snitch",
                  icon: (
                    <path d="M9 11L12 14L22 4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  ),
                  icon2: (
                    <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  ),
                },
              ].map(() => null)}
 
              <div className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                  <path d="M9 11L12 14L22 4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-white/70 mb-0.5">Authenticity Guaranteed</p>
                  <p className="text-[11px] text-white/30">100% original products, verified by Snitch</p>
                </div>
              </div>
 
              <div className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                  <path d="M23 19L16 12L23 5" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 19L1 12L8 5" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-white/70 mb-0.5">Easy Returns</p>
                  <p className="text-[11px] text-white/30">30-day return policy on all products</p>
                </div>
              </div>
 
              <div className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                  <path d="M1 1H5L7.68 14.39C7.77 14.83 8.15 15.16 8.6 15.16H19.4C19.85 15.16 20.23 14.83 20.32 14.39L23 6H6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="20" r="1" stroke="#FFD700" strokeWidth="2" />
                  <circle cx="20" cy="20" r="1" stroke="#FFD700" strokeWidth="2" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-white/70 mb-0.5">Free Shipping</p>
                  <p className="text-[11px] text-white/30">On orders above ₹2,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}