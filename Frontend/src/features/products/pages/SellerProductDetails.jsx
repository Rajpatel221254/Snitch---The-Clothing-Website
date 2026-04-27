import { useState, useEffect, useRef } from "react";
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

const stockStatus = (stock) => {
  const s = Number(stock);
  if (s === 0)
    return {
      label: "Out of Stock",
      color: "#e05252",
      bg: "rgba(224,82,82,0.1)",
      border: "rgba(224,82,82,0.25)",
    };
  if (s <= 10)
    return {
      label: `Low Stock (${s})`,
      color: "#FFD700",
      bg: "rgba(255,215,0,0.08)",
      border: "rgba(255,215,0,0.25)",
    };
  return {
    label: `In Stock (${s})`,
    color: "#4ade80",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.25)",
  };
};

let _uid = 100;
const uid = () => `variant_${_uid++}`;

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle = {
  background: "#0a0a0a",
  border: "1px solid #1e1e1e",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  color: "#f0f0f0",
  width: "100%",
  outline: "none",
  fontFamily: "'Poppins', sans-serif",
  boxSizing: "border-box",
};
const labelStyle = {
  fontSize: 10,
  color: "#555",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};
const btnPrimary = {
  padding: "9px 20px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  border: "none",
  background: "#FFD700",
  color: "#0f0f0f",
  fontFamily: "'Poppins', sans-serif",
  letterSpacing: "0.04em",
};
const btnDanger = {
  padding: "9px 16px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  background: "transparent",
  color: "#e05252",
  border: "1px solid rgba(224,82,82,0.3)",
  fontFamily: "'Poppins', sans-serif",
};

// ─── VariantForm ──────────────────────────────────────────────────────────────
function VariantForm({ variant, index, onChange, onDelete, onSave }) {
  const [expanded, setExpanded] = useState(variant._isNew || false);
  const fileRef = useRef();

  const attrEntries = Object.entries(variant.attributes || {});
  const set = (key, val) => onChange({ ...variant, [key]: val });

  const setAttrKey = (idx, newKey) => {
    const newAttrs = {};
    attrEntries.forEach(([k, v], i) => {
      newAttrs[i === idx ? newKey : k] = v;
    });
    set("attributes", newAttrs);
  };
  const setAttrVal = (idx, val) => {
    const key = attrEntries[idx][0];
    set("attributes", { ...variant.attributes, [key]: val });
  };
  const addAttr = () =>
    set("attributes", {
      ...variant.attributes,
      [`Key${attrEntries.length + 1}`]: "",
    });
  const removeAttr = (idx) => {
    const newAttrs = { ...variant.attributes };
    delete newAttrs[attrEntries[idx][0]];
    set("attributes", newAttrs);
  };

  const handleFiles = (files) => {
    const added = Array.from(files).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
    }));
    set("imageFiles", [...(variant.imageFiles || []), ...added]);
  };

  const removeImage = (i) => {
    const updated = [...(variant.imageFiles || [])];
    URL.revokeObjectURL(updated[i].preview);
    updated.splice(i, 1);
    set("imageFiles", updated);
  };

  const status = stockStatus(variant.stock);

  return (
    <div
      style={{
        background: "#111",
        border: expanded
          ? "1px solid rgba(255,215,0,0.2)"
          : "1px solid #1e1e1e",
        borderRadius: 12,
        marginBottom: 10,
        transition: "border-color 0.2s",
      }}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 16px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#666",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Variant {index + 1}
          </span>
          {attrEntries.length === 0 && (
            <span style={{ fontSize: 11, color: "#444" }}>No attributes</span>
          )}
          {attrEntries.map(([k, v]) => (
            <span
              key={k}
              style={{
                fontSize: 11,
                padding: "2px 10px",
                borderRadius: 999,
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "#bbb",
              }}
            >
              {k}: {v}
            </span>
          ))}
          <span
            style={{
              fontSize: 11,
              padding: "2px 10px",
              borderRadius: 999,
              background: status.bg,
              border: `1px solid ${status.border}`,
              color: status.color,
            }}
          >
            {status.label}
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: "#555",
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "0.2s",
          }}
        >
          ▼
        </span>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1a1a1a" }}>
          {/* Stock + Price */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 16,
              marginBottom: 14,
            }}
          >
            <div>
              <label style={labelStyle}>
                Stock <span style={{ color: "#FFD700" }}>*</span>
              </label>
              <input
                style={inputStyle}
                type="number"
                value={variant.stock}
                placeholder="0"
                onChange={(e) => set("stock", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Price Override (₹)</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="Use base price"
                value={variant.price?.amount}
                onChange={(e) =>
                  set("price", { currency: "INR", amount: e.target.value })
                }
              />
            </div>
          </div>

          {/* Attributes */}
          <label style={labelStyle}>Attributes</label>
          {attrEntries.map(([k, v], idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <input
                style={{ ...inputStyle, flex: 1, fontSize: 12 }}
                placeholder="Key  e.g. Size"
                value={k}
                onChange={(e) => setAttrKey(idx, e.target.value)}
              />
              <input
                style={{ ...inputStyle, flex: 2, fontSize: 12 }}
                placeholder="Value  e.g. M"
                value={v}
                onChange={(e) => setAttrVal(idx, e.target.value)}
              />
              <button
                onClick={() => removeAttr(idx)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#555",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: "0 4px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addAttr}
            style={{
              width: "100%",
              background: "none",
              border: "1px dashed #2a2a2a",
              color: "#666",
              borderRadius: 8,
              padding: "6px",
              fontSize: 12,
              cursor: "pointer",
              marginBottom: 14,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            + Add Attribute
          </button>

          {/* Image Upload */}
          <label style={labelStyle}>Variant Images</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            style={{
              border: "1.5px dashed #2a2a2a",
              borderRadius: 10,
              padding: "18px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: 12,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#FFD700")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#2a2a2a")
            }
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              style={{ margin: "0 auto 6px", display: "block", opacity: 0.3 }}
            >
              <path
                d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <polyline
                points="17 8 12 3 7 8"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="3"
                x2="12"
                y2="15"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <p style={{ fontSize: 12, color: "#555", margin: 0 }}>
              Click or drag & drop images
            </p>
          </div>

          {/* Previews */}
          {(variant.imageFiles || []).length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              {(variant.imageFiles || []).map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={img.preview}
                    alt={img.name}
                    style={{
                      width: 68,
                      height: 68,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #2a2a2a",
                      display: "block",
                    }}
                  />
                  <button
                    onClick={() => removeImage(i)}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#e05252",
                      border: "none",
                      color: "white",
                      fontSize: 11,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              paddingTop: 12,
              borderTop: "1px solid #1a1a1a",
            }}
          >
            <button onClick={() => onDelete(variant._id)} style={btnDanger}>
              Delete
            </button>
            <button
              onClick={() => {
                onSave(variant);
                setExpanded(false);
              }}
              style={btnPrimary}
            >
              Save Variant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SellerProductDetails() {
  const {id} = useParams();
  const navigate = useNavigate();
  const { handleGetProduct, handleCreateVariant } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [variants, setVariants] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await handleGetProduct(id);
        setProduct(data.product);
        setVariants(data.product.variants || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const updateVariant = (updated) =>
    setVariants((prev) =>
      prev.map((v) => (v._id === updated._id ? updated : v)),
    );

  const deleteVariant = (vid) => {
    setVariants((prev) => prev.filter((v) => v._id !== vid));
    showToast("Variant removed");
  };

  const saveVariant = async (variant) => {
    console.log(product);
    const formData = new FormData();
    const priceData = {
      amount: variant.price?.amount || product.price.amount,
      currency: variant.price?.currency || product.price.currency,
    };
    formData.append("stock", Number(variant.stock));
    formData.append("attributes", JSON.stringify(variant.attributes));
    formData.append("price", JSON.stringify(priceData));
    variant.imageFiles?.forEach((f) => formData.append("images", f.file));
    const data = await handleCreateVariant({
      id,
      formData,
    });
    showToast("Variant saved");
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        _id: uid(),
        stock: 0,
        price: null,
        attributes: {},
        imageFiles: [],
        _isNew: true,
      },
    ]);
  };

  const totalStock = variants.reduce((s, v) => s + Number(v.stock || 0), 0);
  const lowCount = variants.filter(
    (v) => Number(v.stock) > 0 && Number(v.stock) <= 10,
  ).length;

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
          <p className="text-xs text-white/30 uppercase tracking-widest">
            Loading product...
          </p>
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
          <p className="text-white/50 mb-6">{error || "Product not found"}</p>
          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            className="px-6 py-3 border border-[#2a2a2a] rounded-[9px] text-xs text-white/40 hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all uppercase tracking-widest"
          >
            ← Back
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
          <span className="text-xl font-extrabold text-[#FFD700] tracking-[8px] uppercase">
            Snitch
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/seller/edit/${id}`)}
              style={btnPrimary}
            >
              Edit Product
            </button>
            <button
              type="button"
              onClick={() => navigate("/seller/dashboard")}
              className="text-[11px] text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest"
            >
              ← Products
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* ── Product Info Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Left — Image gallery (compact) */}
          <div className="space-y-3">
            <div
              className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden"
              style={{ aspectRatio: "3/2" }}
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="3"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 15L8 10L11 13L15 9L21 15"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img._id || i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200
                      ${i === selectedImage ? "border-[#FFD700]" : "border-[#1a1a1a] hover:border-[#2a2a2a]"}`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product details (read-only) */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-widest">
              <span>Products</span>
              <span>/</span>
              <span className="text-[#FFD700]">Details</span>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-1">
                {product.title}
              </h1>
              <p className="text-[10px] text-white/20 font-mono">
                {product._id}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">
                Base Price
              </p>
              <p className="text-3xl font-extrabold text-[#FFD700]">
                {formatPrice(product.price?.amount, product.price?.currency)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">
                Description
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#1a1a1a]">
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">
                  Variants
                </p>
                <p className="text-2xl font-bold">{variants.length}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">
                  Total Stock
                </p>
                <p className="text-2xl font-bold">{totalStock}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">
                  Low Stock
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: lowCount > 0 ? "#FFD700" : "#f0f0f0" }}
                >
                  {lowCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Variants Section ── */}
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  margin: 0,
                  color: "#f0f0f0",
                }}
              >
                Variants
              </h2>
              <p style={{ fontSize: 12, color: "#555", margin: "3px 0 0" }}>
                Manage stock, pricing and images per variant
              </p>
            </div>
            <button onClick={addVariant} style={btnPrimary}>
              + Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div
              style={{
                border: "1.5px dashed #1e1e1e",
                borderRadius: 12,
                padding: "40px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#444", fontSize: 13, margin: "0 0 14px" }}>
                No variants yet
              </p>
              <button onClick={addVariant} style={btnPrimary}>
                + Add First Variant
              </button>
            </div>
          ) : (
            <>
              {variants.map((v, i) => (
                <VariantForm
                  key={v._id}
                  variant={v}
                  index={i}
                  onChange={updateVariant}
                  onDelete={deleteVariant}
                  onSave={saveVariant}
                />
              ))}
              <button
                onClick={addVariant}
                style={{
                  width: "100%",
                  background: "rgba(255,215,0,0.05)",
                  border: "1.5px dashed rgba(255,215,0,0.2)",
                  color: "#FFD700",
                  borderRadius: 12,
                  padding: "12px",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  marginTop: 4,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                + Add Another Variant
              </button>
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 10,
          padding: "12px 18px",
          fontSize: 12,
          color: "#f0f0f0",
          display: toast.show ? "flex" : "none",
          alignItems: "center",
          gap: 8,
          zIndex: 999,
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        <span style={{ color: "#4ade80" }}>✓</span>
        {toast.message}
      </div>
    </div>
  );
}
