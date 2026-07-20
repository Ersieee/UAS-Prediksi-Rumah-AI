import json
from typing import TypedDict, Annotated, List, Dict
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from config import Config

# 1. Definisikan State (Kondisi/Memori bersama antar Agen)
class AgentState(TypedDict):
    task: str
    marketing_draft: str
    manager_feedback: str
    final_output: str
    iterations: int

# Inisialisasi LLM
llm = ChatGroq(
    temperature=0.3,
    groq_api_key=Config.GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile"
)

# 2. Definisikan Agen Marketing (Pembuat Draft)
def marketing_agent(state: AgentState):
    task = state.get("task", "")
    feedback = state.get("manager_feedback", "")
    
    sys_prompt = "Anda adalah Marketing Agent dari perusahaan Enterprise Real Estate."
    if feedback:
        user_prompt = f"Tugas awal: {task}\n\nKritik Manager: {feedback}\n\nSilakan perbaiki draft promosi Anda."
    else:
        user_prompt = f"Tugas: {task}\n\nBuatlah draft promosi yang sangat menarik dan persuasif."
    
    messages = [
        SystemMessage(content=sys_prompt),
        HumanMessage(content=user_prompt)
    ]
    
    response = llm.invoke(messages)
    
    return {"marketing_draft": response.content}

# 3. Definisikan Agen Manager (Reviewer)
def manager_agent(state: AgentState):
    draft = state.get("marketing_draft", "")
    iterations = state.get("iterations", 0)
    
    sys_prompt = "Anda adalah Manager divisi Real Estate yang galak tapi adil. Tugas Anda mereview tulisan Marketing."
    user_prompt = (
        f"Berikut adalah draft promosi dari Marketing:\n\n{draft}\n\n"
        f"Apakah draft ini sudah layak untuk dipublikasi? "
        f"Jika layak, katakan 'APPROVE'. Jika tidak, berikan kritik perbaikannya. "
        f"Jawab dalam bahasa Indonesia. "
        f"(Jika iterasi sudah > 2, Anda harus mengalah dan katakan 'APPROVE' agar tidak looping selamanya)."
    )
    
    if iterations >= 2:
        return {"manager_feedback": "APPROVE", "final_output": draft}
    
    messages = [
        SystemMessage(content=sys_prompt),
        HumanMessage(content=user_prompt)
    ]
    
    response = llm.invoke(messages)
    content = response.content
    
    if "APPROVE" in content.upper():
        return {"manager_feedback": "APPROVE", "final_output": draft}
    else:
        return {"manager_feedback": content, "iterations": iterations + 1}

# 4. Definisikan Kondisi Routing
def route_manager(state: AgentState):
    feedback = state.get("manager_feedback", "")
    if "APPROVE" in feedback.upper():
        return END
    return "marketing"

# 5. Rangkai LangGraph
workflow = StateGraph(AgentState)

workflow.add_node("marketing", marketing_agent)
workflow.add_node("manager", manager_agent)

# Entry point
workflow.set_entry_point("marketing")

# Alur (Edges)
workflow.add_edge("marketing", "manager")

# Conditional Edge (Kembali ke marketing jika direject, atau selesai jika diapprove)
workflow.add_conditional_edges("manager", route_manager)

# Compile Graph
multi_agent_app = workflow.compile()

# Fungsi untuk dipanggil dari routes
def run_enterprise_multi_agent(task_description: str):
    initial_state = {
        "task": task_description,
        "marketing_draft": "",
        "manager_feedback": "",
        "final_output": "",
        "iterations": 0
    }
    
    # Kumpulkan semua steps untuk ditampilkan di UI
    history = []
    
    for event in multi_agent_app.stream(initial_state):
        for key, value in event.items():
            if key == "marketing":
                history.append({
                    "agent": "Marketing Agent",
                    "action": "Membuat Draft",
                    "content": value.get("marketing_draft", "")
                })
            elif key == "manager":
                feedback = value.get("manager_feedback", "")
                action = "Menyetujui Draft (APPROVE)" if "APPROVE" in feedback.upper() else "Menolak & Memberi Kritik"
                history.append({
                    "agent": "Manager Agent",
                    "action": action,
                    "content": feedback
                })
                
    final_state = multi_agent_app.invoke(initial_state) # or just use the stream output
    # Note: invoke runs the whole graph. We already ran stream. 
    # To avoid double running, we just return history.
    
    return history
