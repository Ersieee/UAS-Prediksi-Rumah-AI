from flask import Blueprint, request, jsonify
import traceback
from services.multi_agent_service import run_enterprise_multi_agent

agent_bp = Blueprint('agent_bp', __name__)

@agent_bp.route('/api/run-agents', methods=['POST'])
def run_agents():
    try:
        data = request.json or {}
        task = data.get('task')
        
        if not task:
            return jsonify({'error': 'Tugas (task) tidak boleh kosong'}), 400
            
        # Jalankan LangGraph workflow
        history = run_enterprise_multi_agent(task)
        
        return jsonify({
            'status': 'success',
            'history': history
        }), 200
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f"Gagal menjalankan Multi-Agent: {str(e)}"}), 500
