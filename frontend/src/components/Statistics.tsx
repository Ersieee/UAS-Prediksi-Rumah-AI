import DashboardCard from "./DashboardCard";

interface StatisticsProps {
  dashboard: {
    total_dataset: number;
    total_prediksi: number;
    model: string;
  } | null;
}

export default function Statistics({ dashboard }: StatisticsProps) {
  return (
    <div className="grid grid-cols-4 gap-5">
      <DashboardCard
        title="Total Dataset"
        value={(dashboard?.total_dataset ?? 0).toString()}
        color="bg-blue-600"
      />

      <DashboardCard
        title="Model"
        value={dashboard?.model ?? "-"}
        color="bg-green-600"
      />

      <DashboardCard
        title="Total Prediksi"
        value={(dashboard?.total_prediksi ?? 0).toString()}
        color="bg-purple-600"
      />

      <DashboardCard
        title="Status"
        value="Aktif"
        color="bg-orange-500"
      />
    </div>
  );
}