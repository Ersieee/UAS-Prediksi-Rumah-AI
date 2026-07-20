import os
from flask import Blueprint, request, jsonify
import traceback
from config import Config
from services.rag_service import process_and_store_document, answer_question_with_rag

rag_bp = Blueprint('rag_bp', __name__)

@rag_bp.route('/upload-rag-doc', methods=['POST'])
def upload_rag_doc():
    if 'file' not in request.files:
        return jsonify({'error': 'File tidak ditemukan'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nama file kosong'}), 400

    try:
        file_path = os.path.join(Config.UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        # Proses Text Splitter -> Embedding -> Chroma Vector DB
        total_chunks = process_and_store_document(file_path)

        return jsonify({
            'status': 'success',
            'message': 'Dokumen berhasil di-embedding dan disimpan ke Vector DB (ChromaDB)!',
            'file_name': file.filename,
            'total_chunks': total_chunks
        }), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f"Gagal memproses dokumen RAG: {str(e)}"}), 500


@rag_bp.route('/api/chat-rag-old', methods=['POST'])
@rag_bp.route('/api/chat-rag', methods=['POST'])
@rag_bp.route('/chat-rag', methods=['POST'])
def chat_rag():
    try:
        data = request.json or {}
        user_query = data.get('message') or data.get('query') or ''

        if not user_query:
            return jsonify({'error': 'Pesan tidak boleh kosong'}), 400

        # Panggil RAG Chain LCEL
        ai_response = answer_question_with_rag(user_query)

        return jsonify({
            'status': 'success',
            'response': ai_response,
            'reply': ai_response
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f"Gagal memproses pertanyaan: {str(e)}"}), 500
