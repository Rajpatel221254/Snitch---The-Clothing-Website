import { useState } from "react";
import { useNavigate } from "react-router";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

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

export default function ProductCard({ product, onDelete, onEdit, onRefetch, onclick }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // API shape: product.images = [{ url, _id }]
  const images = product.images || [];
  const coverUrl = images[imgIdx]?.url || null;

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    await onDelete?.(product._id);
    await onRefetch();
    setDeleting(false);
  };

  return (
    <div
      onClick={onclick}
      className="group flex flex-col bg-[#141414] border border-[#1e1e1e] rounded-[14px] overflow-hidden hover:border-[#2e2e2e] transition-all duration-300"
    >
      {/* ── Image area ── */}
      <div className="relative h-52 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="1.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M3 15L8 10L11 13L15 9L21 15"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] uppercase tracking-wider">
              No Image
            </span>
          </div>
        )}

        {/* Image dots — thumbnail switcher */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImgIdx(i)}
                className="border-none cursor-pointer transition-all duration-200 rounded-full"
                style={{
                  width: i === imgIdx ? "16px" : "6px",
                  height: "6px",
                  background:
                    i === imgIdx ? "#FFD700" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        )}

        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white/60 text-[10px] font-medium px-2 py-0.5 rounded-full">
            {images.length} photos
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="text-[14px] font-semibold text-white leading-snug line-clamp-1 mb-1.5">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-white/28 leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="text-[20px] font-extrabold text-[#FFD700] tracking-tight mb-4">
          {formatPrice(product.price?.amount, product.price?.currency)}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1e1e1e]">
          <span className="text-[10px] text-white/20 uppercase tracking-wide">
            ID: {product._id?.slice(-6)}
          </span>
          {product.createdAt && (
            <span className="text-[10px] text-white/20">
              {timeAgo(product.createdAt)}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(product._id)}
            className="flex-1 py-2 text-[11px] font-semibold uppercase tracking-[1px] text-white/40 bg-transparent border border-[#2a2a2a] rounded-[8px] hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-all duration-200 cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={`
              flex-1 py-2 text-[11px] font-semibold uppercase tracking-[1px] rounded-[8px] border transition-all duration-200 cursor-pointer
              ${
                confirmDelete
                  ? "bg-red-500/15 border-red-500/40 text-red-400"
                  : "bg-transparent border-[#2a2a2a] text-white/28 hover:border-red-500/40 hover:text-red-400"
              }
            `}
          >
            {deleting ? "Deleting…" : confirmDelete ? "Confirm?" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
