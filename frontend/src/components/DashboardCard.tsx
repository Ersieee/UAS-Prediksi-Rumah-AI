interface Props {
  title: string;
  value: string | number;
  color: string;
}

export default function DashboardCard({
  title,
  value,
  color,
}: Props) {
  return (
    <div
      className={`rounded-2xl border border-white/20 p-6 text-white shadow-lg shadow-slate-200/70 hover:-translate-y-1 hover:shadow-xl transition ${color}`}
    >
      <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-80">
        {title}
      </p>
      <h1 className="text-3xl font-bold mt-3">{value}</h1>
    </div>
  );
}