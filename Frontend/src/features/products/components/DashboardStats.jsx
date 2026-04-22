export default function DashboardStats({ products }) {
  const total = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price?.amount || 0),
    0
  );
  const withImages = products.filter((p) => p.images?.length > 0).length;
  const avgPrice = total > 0 ? Math.round(totalValue / total) : 0;

  const stats = [
    { label: "Total Products", value: total, gold: true },
    { label: "Avg. Price", value: `₹${avgPrice.toLocaleString("en-IN")}` },
    { label: "With Images", value: withImages },
    { label: "Catalogue Value", value: `₹${totalValue.toLocaleString("en-IN")}` },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-[#141414] border border-[#1e1e1e] rounded-[12px] px-5 py-4"
        >
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[1.5px] mb-2">
            {s.label}
          </p>
          <p
            className="text-2xl font-extrabold leading-none"
            style={{ color: s.gold ? "#FFD700" : "#fff" }}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
