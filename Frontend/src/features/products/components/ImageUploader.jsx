import { useRef } from "react";

const MAX_IMAGES = 7;

export default function ImageUploader({ images, onAdd, onRemove }) {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const incoming = Array.from(files);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const allowed = incoming.slice(0, remaining);
    onAdd(allowed);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div>
      <label className="block text-[10.5px] font-semibold text-white/35 tracking-[1.4px] uppercase mb-3">
        Product Images{" "}
        <span className="text-[#FFD700]/60 normal-case tracking-normal text-[10px]">
          (max {MAX_IMAGES})
        </span>
      </label>

      {/* Drop zone — only show when slots remain */}
      {images.length < MAX_IMAGES && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="
            w-full border-2 border-dashed border-[#2c2c2c] rounded-[12px]
            flex flex-col items-center justify-center gap-2
            py-8 px-4 cursor-pointer
            hover:border-[#FFD700]/50 hover:bg-[#FFD700]/[0.03]
            transition-all duration-200 mb-4
          "
        >
          {/* Upload icon */}
          <div className="w-10 h-10 rounded-full bg-[#1e1e1e] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V8M12 8L9 11M12 8L15 11"
                stroke="#FFD700"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 16.5V18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75V16.5"
                stroke="#FFD700"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-[13px] text-white/40 text-center leading-relaxed">
            Drop images here or{" "}
            <span className="text-[#FFD700] font-semibold">browse</span>
          </p>
          <p className="text-[11px] text-white/20">
            {images.length}/{MAX_IMAGES} uploaded · JPG, PNG, WEBP
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Previews grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group aspect-square rounded-[10px] overflow-hidden border border-[#2c2c2c]"
            >
              <img
                src={img.preview}
                alt={`product-${i}`}
                className="w-full h-full object-cover"
              />
              {/* Index badge */}
              <div className="absolute top-1.5 left-1.5 bg-black/60 text-[#FFD700] text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {i + 1}
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="
                  absolute top-1.5 right-1.5
                  w-6 h-6 rounded-full bg-black/70
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200 cursor-pointer border-none
                "
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1 1L9 9M9 1L1 9"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {/* Main badge for first image */}
              {i === 0 && (
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-[#FFD700]/90 text-[#0f0f0f] text-[8px] font-bold uppercase tracking-wide text-center py-0.5 rounded-[4px]">
                  Cover
                </div>
              )}
            </div>
          ))}

          {/* Add more tile — if slots remain after first upload */}
          {images.length < MAX_IMAGES && (
            <div
              onClick={() => inputRef.current?.click()}
              className="
                aspect-square rounded-[10px] border-2 border-dashed border-[#2c2c2c]
                flex flex-col items-center justify-center gap-1
                cursor-pointer hover:border-[#FFD700]/40 hover:bg-[#FFD700]/[0.03]
                transition-all duration-200
              "
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="#FFD700"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[9px] text-white/25 uppercase tracking-wide">
                Add
              </span>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
