import ImageSlider from "../components/ImageSlider";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      className="flex min-h-screen bg-[#0f0f0f]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* Left — image slider */}
      <ImageSlider />

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:px-14 overflow-y-auto">
        <div className="w-full max-w-95">

          {/* Brand logo */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#FFD700] tracking-[8px] uppercase leading-none">
              Snitch
            </h2>
            <p className="text-[10px] text-white/25 tracking-[3px] uppercase mt-2">
              {subtitle}
            </p>
          </div>

          {/* Page content */}
          {children}
        </div>
      </div>
    </div>
  );
}
