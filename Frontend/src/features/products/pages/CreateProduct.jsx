import { useState } from "react";
import ImageUploader from "../components/ImageUploader.jsx";
import { useProduct } from "../hook/useProduct.js";
import { useNavigate } from "react-router";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];

const labelCls =
  "block text-[10.5px] font-semibold text-white/35 tracking-[1.4px] uppercase mb-2";

const inputCls =
  "w-full bg-[#161616] border border-[#2c2c2c] rounded-[10px] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 transition-all duration-200 focus:border-[#FFD700] focus:shadow-[0_0_0_3px_rgba(255,215,0,0.10)]";

export default function CreateProduct() {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  /* ── Form state ── */
  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  /* images: [{ file: File, preview: string }] */
  const [images, setImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  /* Two-way binding helper */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* Image handlers */
  const handleAddImages = (files) => {
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((p) => [...p, ...newImgs]);
    setErrors((p) => ({ ...p, images: "" }));
  };

  const handleRemoveImage = (idx) => {
    setImages((p) => {
      URL.revokeObjectURL(p[idx].preview);
      return p.filter((_, i) => i !== idx);
    });
  };

  /* Validation */
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
    if (images.length === 0) e.images = "Upload at least one image.";
    return e;
  };

  /* Build FormData & submit */
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("priceAmount", form.priceAmount);
    fd.append("priceCurrency", form.priceCurrency);
    images.forEach((img) => {
      fd.append("images", img.file);
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    const response = await handleCreateProduct(fd);
    navigate("/seller/dashboard");
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

      {/* ── Top Nav ── */}
      <nav className="border-b border-[#1e1e1e] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-sm z-10">
        <a
          href="/"
          className="text-xl font-extrabold text-[#FFD700] tracking-[6px] uppercase no-underline"
        >
          Snitch
        </a>
        <div className="flex items-center gap-2 text-[11px] text-white/30 uppercase tracking-[1.5px]">
          <span className="text-white/20">Dashboard</span>
          <span className="text-white/15 mx-1">/</span>
          <span className="text-[#FFD700]">New Product</span>
        </div>
      </nav>

      {/* ── Page body ── */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-14">
        {/* Page header */}
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-[4px] text-[#FFD700]/60 uppercase mb-2">
            Seller Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
            Create Product
          </h1>
          <p className="text-sm text-white/30 mt-2 font-light">
            Fill in the details below to list a new product on Snitch.
          </p>
        </div>

        {/* ── Two-column layout on md+ ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 items-start">
          {/* LEFT — main fields */}
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

            {/* Price row */}
            <div>
              <label className={labelCls}>Price</label>
              <div className="flex gap-3">
                {/* Currency selector */}
                <div className="relative">
                  <select
                    name="priceCurrency"
                    value={form.priceCurrency}
                    onChange={handleChange}
                    className="
                      appearance-none bg-[#161616] border border-[#2c2c2c]
                      rounded-[10px] px-4 py-3 text-sm text-[#FFD700] font-semibold
                      outline-none cursor-pointer pr-8
                      focus:border-[#FFD700] focus:shadow-[0_0_0_3px_rgba(255,215,0,0.10)]
                      transition-all duration-200
                    "
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {/* Chevron */}
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
                <div className="flex-1">
                  <input
                    type="number"
                    name="priceAmount"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={form.priceAmount}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>
              {errors.priceAmount && (
                <p className="text-[11px] text-red-400 mt-1.5">
                  {errors.priceAmount}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT — image uploader */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-[14px] p-5 md:p-6">
            <ImageUploader
              images={images}
              onAdd={handleAddImages}
              onRemove={handleRemoveImage}
            />
            {errors.images && (
              <p className="text-[11px] text-red-400 mt-2">{errors.images}</p>
            )}

            {/* Upload count pill */}
            {images.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-white/25">
                  {images.length} / 7 images
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-5 rounded-full transition-all duration-300"
                      style={{
                        background:
                          i < images.length
                            ? "#FFD700"
                            : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-[#1e1e1e] my-10" />

        {/* ── Bottom action bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="/seller/dashboard"
            className="text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200 no-underline"
          >
            ← Back to Dashboard
          </a>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Save as draft */}
            <button
              type="button"
              className="
                flex-1 sm:flex-none px-6 py-[13px]
                border border-[#2c2c2c] rounded-[10px]
                text-[13px] font-semibold text-white/40
                hover:border-white/20 hover:text-white/60
                transition-all duration-200 cursor-pointer bg-transparent
                tracking-[1px] uppercase
              "
            >
              Save Draft
            </button>

            {/* Publish */}
            <button
              type="button"
              onClick={handleSubmit}
              className="
                flex-1 sm:flex-none px-8 py-[13px]
                bg-[#FFD700] hover:bg-[#e6c200] active:scale-[0.975]
                rounded-[10px] text-[13px] font-bold text-[#0f0f0f]
                tracking-[2px] uppercase transition-all duration-200
                cursor-pointer border-none
              "
            >
              {submitted ? "Published ✓" : "Publish Product"}
            </button>
          </div>
        </div>

        {/* Success toast */}
        {submitted && (
          <div className="mt-6 bg-[#FFD700]/10 border border-[#FFD700]/25 rounded-[10px] px-5 py-4 flex items-center gap-3">
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
                Product published!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
