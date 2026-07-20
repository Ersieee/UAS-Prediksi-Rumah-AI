import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { bulan: "Jan", harga: 250 },
  { bulan: "Feb", harga: 280 },
  { bulan: "Mar", harga: 300 },
  { bulan: "Apr", harga: 340 },
  { bulan: "Mei", harga: 360 },
  { bulan: "Jun", harga: 390 },
];

export default function PriceChart() {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 mt-8">

      <h2 className="text-xl font-bold mb-5">
        Grafik Harga Rumah
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="bulan"/>

          <YAxis/>

          <Tooltip/>

          <Line
            type="monotone"
            dataKey="harga"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}