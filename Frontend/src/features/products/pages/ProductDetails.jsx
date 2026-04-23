import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
  const {handleGetProduct} = useProduct()

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
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
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
          <p className="text-sm text-white/30 uppercase tracking-wider">Loading product...</p>
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
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#f87171" strokeWidth="1.8" />
              <path d="M12 8V12M12 16H12.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-white/50 mb-6">{error || "Product not found"}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 border border-[#2a2a2a] rounded-[9px] text-[12px] text-white/40 hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all duration-200 uppercase tracking-wide"
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-[#FFD700] tracking-[8px] uppercase no-underline">
            Snitch
          </a>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-[12px] text-white/40 hover:text-white/80 transition-colors uppercase tracking-[1.5px]"
          >
            ← Back to Shop
          </button>
        </div>
      </nav>

      {/* ── Product Detail ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* LEFT — Image Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-[4/5] bg-[#0a0a0a] border border-[#1a1a1a] rounded-[16px] overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.1">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 15L8 10L11 13L15 9L21 15" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={img._id || i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`
                      flex-shrink-0 w-20 h-20 rounded-[10px] overflow-hidden border-2 transition-all duration-200 cursor-pointer
                      ${i === selectedImage
                        ? "border-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.25)]"
                        : "border-[#1a1a1a] hover:border-[#2a2a2a]"
                      }
                    `}
                  >
                    <img
                      src={img.url}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Product Info */}
          <div className="flex flex-col">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] text-white/20 uppercase tracking-[1.5px] mb-6">
              <a href="/" className="hover:text-white/50 transition-colors no-underline">Home</a>
              <span>/</span>
              <span className="text-[#FFD700]">Product</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-8">
              <p className="text-[11px] text-white/25 uppercase tracking-[1.5px] mb-2">
                Price
              </p>
              <p className="text-4xl font-extrabold text-[#FFD700] tracking-tight">
                {formatPrice(product.price?.amount, product.price?.currency)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-10">
              <p className="text-[11px] text-white/25 uppercase tracking-[1.5px] mb-3">
                Description
              </p>
              <p className="text-base text-white/50 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product ID */}
            <div className="mb-10 pb-10 border-b border-[#1a1a1a]">
              <p className="text-[10px] text-white/15 uppercase tracking-[1.2px] mb-1">
                Product ID
              </p>
              <p className="text-[11px] text-white/20 font-mono">
                {product._id}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                type="button"
                className="flex-1 px-8 py-4 bg-[#FFD700] hover:bg-[#e6c200] active:scale-[0.98] rounded-[10px] text-[13px] font-bold text-[#0f0f0f] uppercase tracking-[2px] transition-all duration-200 border-none cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="flex-1 px-8 py-4 border border-[#2a2a2a] hover:border-[#FFD700]/40 rounded-[10px] text-[13px] font-semibold text-white/50 hover:text-[#FFD700] uppercase tracking-[1.5px] transition-all duration-200 cursor-pointer bg-transparent"
              >
                Add to Wishlist
              </button>
            </div>

            {/* Additional info */}
            <div className="mt-10 pt-10 border-t border-[#1a1a1a] space-y-4">
              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                  <path d="M9 11L12 14L22 4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-white/70 mb-1">Authenticity Guaranteed</p>
                  <p className="text-[12px] text-white/30">100% original products, verified by Snitch</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                  <path d="M23 19L16 12L23 5" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 19L1 12L8 5" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-white/70 mb-1">Easy Returns</p>
                  <p className="text-[12px] text-white/30">30-day return policy on all products</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                  <path d="M1 1H5L7.68 14.39C7.77 14.83 8.15 15.16 8.6 15.16H19.4C19.85 15.16 20.23 14.83 20.32 14.39L23 6H6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="20" r="1" stroke="#FFD700" strokeWidth="2" />
                  <circle cx="20" cy="20" r="1" stroke="#FFD700" strokeWidth="2" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-white/70 mb-1">Free Shipping</p>
                  <p className="text-[12px] text-white/30">On orders above ₹2,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
