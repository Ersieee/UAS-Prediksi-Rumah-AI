import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Dataset from "./pages/Dataset";
import Prediction from "./pages/Prediction";
import History from "./pages/History";
import Assistant from "./pages/Assistant";
import Training from "./pages/Training";
import EnterpriseAgents from "./pages/EnterpriseAgents";
import Evaluation from "./pages/Evaluation";
import UploadDataset from "./components/UploadDataset"; // <-- Import komponen upload
import { getDashboard } from "./services/dashboard";

interface DashboardData {
  total_dataset: number;
  total_prediksi: number;
  model: string;
}

function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const runLoad = async () => {
      if (cancelled) return;
      await loadDashboard();
    };

    void runLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  console.log(dashboard);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard dashboard={dashboard} />} />
        <Route path="/dataset" element={<Dataset />} />

        {/* TAMBAHAN: Rute baru khusus untuk upload dataset */}
        <Route path="/upload-dataset" element={<UploadDataset />} />

        <Route path="/prediction" element={<Prediction />} />
        <Route path="/training" element={<Training />} />
        <Route path="/history" element={<History />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/enterprise-agents" element={<EnterpriseAgents />} />
        <Route path="/evaluation" element={<Evaluation />} />
      </Routes>
    </MainLayout>
  );
}

export default App;