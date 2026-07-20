import json
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from config import Config

# Inisialisasi LLM Judge
llm_judge = ChatGroq(
    temperature=0.1,
    groq_api_key=Config.GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile"
)

def evaluate_ai_response(user_query: str, ai_response: str, context: str = ""):
    sys_prompt = (
        "Anda adalah seorang Quality Assurance (QA) Analyst senior yang sangat ketat dan kritis. "
        "Tugas Anda adalah mengevaluasi respons dari staf (customer service) berdasarkan dokumen/SOP yang berlaku. "
        "ATURAN MUTLAK:\n"
        "- Skor Accuracy MAKSIMAL yang boleh diberikan adalah 93. Tidak peduli seberapa bagus jawabannya, selalu kurangi 7-15 poin untuk minor imperfection.\n"
        "- Skor Effectiveness MAKSIMAL adalah 88.\n"
        "- Skor Hallucination berikan di angka 2 hingga 15 (Jangan pernah 0, karena staf manusia selalu punya ruang interpretasi).\n"
        "- Gunakan bahasa auditor/manusia (seperti: 'Respons staf sudah lumayan, namun...', 'Cara staf menjawab...'). JANGAN PERNAH memakai kata 'AI', 'Model', 'Prompt', atau 'LLM'.\n\n"
        "Berikan skor (0-100) untuk metrik berikut:\n"
        "1. Accuracy\n"
        "2. Effectiveness\n"
        "3. Hallucination\n\n"
        "Output HARUS JSON MURNI tanpa markdown (```json ... ```), contoh:\n"
        "{\n"
        "  \"accuracy_score\": 86,\n"
        "  \"effectiveness_score\": 82,\n"
        "  \"hallucination_score\": 5,\n"
        "  \"reasoning\": \"Staf sudah menjawab dengan benar sesuai SOP, namun kalimatnya bisa dibuat lebih ramah...\"\n"
        "}"
    )
    
    user_prompt = (
        f"Referensi Data / SOP:\n{context}\n\n"
        f"Pertanyaan Klien:\n{user_query}\n\n"
        f"Jawaban Staf (Untuk dinilai):\n{ai_response}"
    )
    
    messages = [
        SystemMessage(content=sys_prompt),
        HumanMessage(content=user_prompt)
    ]
    
    try:
        response = llm_judge.invoke(messages)
        content = response.content.strip()
        
        # Bersihkan markdown json jika ada
        if content.startswith("```json"):
            content = content.replace("```json", "", 1)
        if content.endswith("```"):
            content = content[:-3]
            
        result = json.loads(content)
        return result
    except Exception as e:
        print("Evaluator Error:", e)
        return {
            "accuracy_score": 0,
            "effectiveness_score": 0,
            "hallucination_score": 0,
            "reasoning": f"Gagal melakukan evaluasi: {str(e)}"
        }
