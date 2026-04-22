import { useState, useRef } from "react";
import { useProduct } from "../hook/useProduct";
import { useParams } from "react-router";
import { useEffect } from "react";

/**
 * EditProduct
 *
 * Props:
 *   product  – existing product object from API:
 *              { _id, title, description, price: { amount, currency }, images: [{ url, _id }] }
 *   onSubmit – (formData: FormData, productId: string) => Promise<void>
 *              caller does: PUT /api/seller/products/edit/:id  with the FormData
 */

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];
const MAX_IMAGES = 7;

const labelCls =
  "block text-[10.5px] font-semibold text-white/35 tracking-[1.4px] uppercase mb-2";

const inputCls =
  "w-full bg-[#161616] border border-[#2c2c2c] rounded-[10px] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 transition-all duration-200 focus:border-[#FFD700] focus:shadow-[0_0_0_3px_rgba(255,215,0,0.10)]";

export default function EditProduct({ id, product }) {

  const {handleEditProduct} = useProduct()

  /* ── Pre-fill form from existing product ── */
  const [form, setForm] = useState({
    title: product.title || "",
    description: product.description || "",
    priceAmount: product.price.amount || "",
    priceCurrency: product.price.currency || "",
  });

  /**
   * existingImages  – images already on the server: [{ url, _id }]
   * newImages       – newly picked local files:     [{ file: File, preview: string }]
   *
   * If user uploads new files  → send them via FormData field "images"
   * If user keeps existing only → send no files (backend keeps product.images as-is)
   */
  const [existingImages, setExistingImages] = useState(product.images);
  const [newImages, setNewImages] = useState([]);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef(null);

  const totalImages = existingImages.length + newImages.length;

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePickFiles = (files) => {
    const incoming = Array.from(files);
    const slots = MAX_IMAGES - totalImages;
    if (slots <= 0) return;
    const allowed = incoming.slice(0, slots);
    const mapped = allowed.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages((p) => [...p, ...mapped]);
    setErrors((p) => ({ ...p, images: "" }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handlePickFiles(e.dataTransfer.files);
  };

  const removeExisting = (idx) =>
    setExistingImages((p) => p.filter((_, i) => i !== idx));

  const removeNew = (idx) => {
    setNewImages((p) => {
      URL.revokeObjectURL(p[idx].preview);
      return p.filter((_, i) => i !== idx);
    });
  };

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (
      !form.priceAmount ||
      isNaN(form.priceAmount) ||
      Number(form.priceAmount) <= 0
    )
      e.priceAmount = "Enter a valid price.";
    if (totalImages === 0) e.images = "At least one image is required.";
    return e;
  };

  /* ── Build FormData & call onSubmit ── */
  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("priceAmount", form.priceAmount);
    fd.append("priceCurrency", form.priceCurrency);

    // Only append new files — if none, backend keeps existing images unchanged
    newImages.forEach((img) => fd.append("images", img.file));

    try {
      await handleEditProduct(id, fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0f0f0f] text-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        ::placeholder { color: rgba(255,255,255,0.18); font-size: 13px; }
        select option { background: #1a1a1a; color: #fff; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-20 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-[#1a1a1a] px-5 md:px-10 py-4 flex items-center justify-between gap-4">
        <a
          href="/"
          className="text-xl font-extrabold text-[#FFD700] tracking-[6px] uppercase no-underline"
        >
          Snitch
        </a>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/25 uppercase tracking-[1.5px]">
          <a
            href="/seller/dashboard"
            className="hover:text-white/50 transition-colors no-underline text-white/25"
          >
            Dashboard
          </a>
          <span className="text-white/15">/</span>
          <span className="text-[#FFD700]">Edit Product</span>
        </div>
        <a
          href="/seller/dashboard"
          className="shrink-0 text-[12px] text-white/30 hover:text-white/60 transition-colors duration-200 no-underline uppercase tracking-wide"
        >
          ← Back
        </a>
      </nav>

      {/* ── Page body ── */}
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-10 md:py-14">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-[4px] text-[#FFD700]/55 uppercase mb-2">
            Seller Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
            Edit Product
          </h1>
          <p className="text-sm text-white/25 mt-2 font-light">
            Update the details below. Only changed fields will be saved.
          </p>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 items-start">
          {/* LEFT — text fields */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className={labelCls}>Product Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Oversized Drop-shoulder Tee"
                value={form.title}
                onChange={handleChange}
                className={inputCls}
              />
              {errors.title && (
                <p className="text-[11px] text-red-400 mt-1.5">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                name="description"
                placeholder="Describe the product — material, fit, style notes..."
                value={form.description}
                onChange={handleChange}
                rows={5}
                className={`${inputCls} resize-none leading-relaxed`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-400 mt-1.5">
                  {errors.description}
                </p>
              )}
              <p className="text-[11px] text-white/20 mt-1.5 text-right">
                {form.description.length} chars
              </p>
            </div>

            {/* Price */}
            <div>
              <label className={labelCls}>Price</label>
              <div className="flex gap-3">
                {/* Currency */}
                <div className="relative">
                  <select
                    name="priceCurrency"
                    value={form.priceCurrency}
                    onChange={handleChange}
                    className="appearance-none bg-[#161616] border border-[#2c2c2c] rounded-[10px] px-4 py-3 pr-8 text-sm text-[#FFD700] font-semibold outline-none cursor-pointer focus:border-[#FFD700] focus:shadow-[0_0_0_3px_rgba(255,215,0,0.10)] transition-all duration-200"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="#FFD700"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {/* Amount */}
                <input
                  type="number"
                  name="priceAmount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.priceAmount}
                  onChange={handleChange}
                  className={`${inputCls} flex-1`}
                />
              </div>
              {errors.priceAmount && (
                <p className="text-[11px] text-red-400 mt-1.5">
                  {errors.priceAmount}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT — image manager */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-[14px] p-5">
            <div className="flex items-center justify-between mb-4">
              <label className={labelCls + " mb-0"}>
                Images
                <span className="text-[#FFD700]/50 normal-case tracking-normal text-[10px] ml-1">
                  (max 7)
                </span>
              </label>
              <span className="text-[11px] text-white/25">
                {totalImages} / {MAX_IMAGES}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1 mb-5">
              {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i < totalImages ? "#FFD700" : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>

            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] text-white/20 uppercase tracking-[1.2px] mb-2.5">
                  Existing Images
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img, i) => (
                    <div
                      key={img._id}
                      className="relative group aspect-square rounded-[9px] overflow-hidden border border-white/10"
                    >
                      <img
                        src={img.url}
                        alt={`existing-${i}`}
                        className="w-full h-full object-cover"
                      />

                      {/* OLD badge */}
                      <div className="absolute top-1 left-1 bg-white/80 text-black text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-[3px]">
                        Old
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeExisting(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-none"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1 1L7 7M7 1L1 7"
                            stroke="white"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images */}
            {newImages.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] text-white/20 uppercase tracking-[1.2px] mb-2.5">
                  New Uploads
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {newImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-[9px] overflow-hidden border border-[#FFD700]/20"
                    >
                      <img
                        src={img.preview}
                        alt={`new-${i}`}
                        className="w-full h-full object-cover"
                      />
                      {/* New badge */}
                      <div className="absolute top-1 left-1 bg-[#FFD700] text-[#0f0f0f] text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-[3px]">
                        New
                      </div>
                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer border-none"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1 1L7 7M7 1L1 7"
                            stroke="white"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drop zone — when slots remain */}
            {totalImages < MAX_IMAGES && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-full border-2 border-dashed border-[#272727] rounded-[10px] flex flex-col items-center justify-center gap-2 py-6 px-4 cursor-pointer hover:border-[#FFD700]/40 hover:bg-[#FFD700]/[0.02] transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 16V8M12 8L9 11M12 8L15 11"
                      stroke="#FFD700"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 16.5V18.75C3 19.99 4.01 21 5.25 21H18.75C19.99 21 21 19.99 21 18.75V16.5"
                      stroke="#FFD700"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-[12px] text-white/35 text-center">
                  Drop or{" "}
                  <span className="text-[#FFD700] font-semibold">browse</span>{" "}
                  to add images
                </p>
                <p className="text-[10px] text-white/18">
                  {MAX_IMAGES - totalImages} slot
                  {MAX_IMAGES - totalImages !== 1 ? "s" : ""} remaining
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePickFiles(e.target.files)}
                />
              </div>
            )}

            {errors.images && (
              <p className="text-[11px] text-red-400 mt-2">{errors.images}</p>
            )}

            {/* Note about image replace behaviour */}
            {newImages.length > 0 && (
              <p className="text-[10px] text-[#FFD700]/40 mt-3 leading-relaxed">
                Uploading new images will replace all existing ones on save.
              </p>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-[#1e1e1e] my-10" />

        {/* ── Action bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="/seller/dashboard"
            className="text-[13px] text-white/28 hover:text-white/55 transition-colors duration-200 no-underline"
          >
            ← Back to Dashboard
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Discard */}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 sm:flex-none px-6 py-[13px] border border-[#2c2c2c] rounded-[10px] text-[13px] font-semibold text-white/35 hover:border-white/20 hover:text-white/55 transition-all duration-200 cursor-pointer bg-transparent tracking-[1px] uppercase"
            >
              Discard
            </button>

            {/* Save */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none px-8 py-[13px] bg-[#FFD700] hover:bg-[#e6c200] active:scale-[0.975] disabled:opacity-60 disabled:cursor-not-allowed rounded-[10px] text-[13px] font-bold text-[#0f0f0f] tracking-[2px] uppercase transition-all duration-200 cursor-pointer border-none"
            >
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* ── Success banner ── */}
        {saved && (
          <div className="mt-6 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-[10px] px-5 py-4 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5L4.5 8.5L11 1.5"
                  stroke="#0f0f0f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#FFD700]">
                Product updated successfully!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
