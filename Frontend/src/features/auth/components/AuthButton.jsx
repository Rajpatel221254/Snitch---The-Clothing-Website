export default function AuthButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full py-3.5 bg-[#FFD700] hover:bg-[#e6c200]
        active:scale-[0.975] rounded-[10px]
        text-[13px] font-bold text-[#0f0f0f]
        tracking-[2px] uppercase
        transition-all duration-200
        cursor-pointer border-none mb-5
      "
    >
      {children}
    </button>
  );
}
