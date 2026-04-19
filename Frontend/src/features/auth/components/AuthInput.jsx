export default function AuthInput({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="mb-5">
      <label className="block text-[10.5px] font-semibold text-white/35 tracking-[1.4px] uppercase mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full bg-[#161616] border border-[#2c2c2c] rounded-[10px]
          px-4 py-3 text-sm text-white outline-none
          placeholder:text-white/20
          transition-all duration-200
          focus:border-[#FFD700] focus:shadow-[0_0_0_3px_rgba(255,215,0,0.10)]
        "
      />
    </div>
  );
}
