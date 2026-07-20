import requests
import json
import traceback

def test_api():
    report = "# Laporan Live Testing API (report.md)\n\n"
    report += "Berikut adalah hasil pengujian langsung (*live testing*) dari fitur-fitur baru (Multi-Agent & Evaluator).\n\n"
    
    # 1. Test Multi-Agent
    report += "## 1. Multi-Agent Simulation Endpoint (`/api/run-agents`)\n"
    try:
        res = requests.post(
            "http://127.0.0.1:5000/api/run-agents", 
            json={"task": "Buat draft promosi rumah tipe 45"}
        )
        if res.status_code == 200:
            data = res.json()
            report += "✅ **Status:** Berhasil (200 OK)\n"
            report += f"- **Jumlah Iterasi:** {len(data.get('history', []))} langkah\n"
            report += "- **Respons Akhir (Manager):** " + str(data.get('history', [])[-1].get('action')) + "\n"
        else:
            report += f"❌ **Status:** Gagal ({res.status_code})\n"
            report += f"- **Error Detail:** {res.text}\n"
    except Exception as e:
        report += f"❌ **Error Koneksi:** {str(e)}\n"
        traceback.print_exc()

    report += "\n---\n"
    
    # 2. Test Evaluator
    report += "## 2. LLM Evaluator Endpoint (`/api/evaluate`)\n"
    try:
        res = requests.post(
            "http://127.0.0.1:5000/api/evaluate", 
            json={
                "user_query": "Berapa harga rumah tipe 36?",
                "ai_response": "Harga rumah tipe 36 adalah Rp 450.000.000",
                "context": "Tipe 36/60 harganya Rp 450.000.000"
            }
        )
        if res.status_code == 200:
            data = res.json()
            eval_data = data.get('evaluation', {})
            report += "✅ **Status:** Berhasil (200 OK)\n"
            report += f"- **Accuracy Score:** {eval_data.get('accuracy_score')}\n"
            report += f"- **Effectiveness Score:** {eval_data.get('effectiveness_score')}\n"
            report += f"- **Hallucination Score:** {eval_data.get('hallucination_score')}\n"
            report += f"- **Reasoning:** {eval_data.get('reasoning')}\n"
        else:
            report += f"❌ **Status:** Gagal ({res.status_code})\n"
            report += f"- **Error Detail:** {res.text}\n"
    except Exception as e:
        report += f"❌ **Error Koneksi:** {str(e)}\n"
        traceback.print_exc()

    # Save to file
    with open("c:/Users/Yosalfa/PrediksiRumahAI/report.md", "w", encoding="utf-8") as f:
        f.write(report)
        
    print("Laporan testing berhasil dibuat di report.md")

if __name__ == "__main__":
    test_api()
