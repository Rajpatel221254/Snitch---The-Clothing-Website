import { useNavigate } from "react-router";

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

export default function HomeProductCard({ product }) {
  const navigate = useNavigate();

  const coverImage = product.images?.[0]?.url;
  const imageCount = product.images?.length || 0;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group cursor-pointer bg-[#0a0a0a] border border-[#1a1a1a] rounded-[16px] overflow-hidden hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,215,0,0.12)]"
    >
      {/* Image */}
      <div className="relative h-72 bg-[#0e0e0e] overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" opacity="0.15">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 15L8 10L11 13L15 9L21 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* Image count badge */}
        {imageCount > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white/60 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
            +{imageCount - 1}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-white/90 mb-2 line-clamp-1 group-hover:text-[#FFD700] transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-[13px] text-white/35 leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-extrabold text-[#FFD700] tracking-tight">
            {formatPrice(product.price?.amount, product.price?.currency)}
          </span>
          <span className="text-[11px] text-white/20 uppercase tracking-wider">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
}
