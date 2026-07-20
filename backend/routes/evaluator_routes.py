from flask import Blueprint, request, jsonify
import traceback
from services.evaluator_service import evaluate_ai_response

evaluator_bp = Blueprint('evaluator_bp', __name__)

@evaluator_bp.route('/api/evaluate', methods=['POST'])
def evaluate_endpoint():
    try:
        data = request.json or {}
        user_query = data.get('user_query', '')
        ai_response = data.get('ai_response', '')
        context = data.get('context', '')
        
        if not user_query or not ai_response:
            return jsonify({'error': 'Parameter user_query dan ai_response wajib diisi'}), 400
            
        eval_result = evaluate_ai_response(user_query, ai_response, context)
        
        return jsonify({
            'status': 'success',
            'evaluation': eval_result
        }), 200
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f"Gagal menjalankan Evaluator: {str(e)}"}), 500
