import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { luas: 60, harga: 450 },
  { luas: 70, harga: 520 },
  { luas: 80, harga: 610 },
  { luas: 90, harga: 690 },
  { luas: 100, harga: 760 },
  { luas: 110, harga: 850 },
  { luas: 120, harga: 930 },
  { luas: 130, harga: 1010 },
  { luas: 140, harga: 1100 },
  { luas: 150, harga: 1180 },
];

export default function DataChart() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      <h2 className="text-xl font-bold mb-5">
        Grafik Harga Rumah
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="luas" />

          <YAxis />

          <Tooltip />

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