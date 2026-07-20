import os
import warnings
warnings.filterwarnings("ignore")

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from services.database import init_db

# Import Blueprints
from routes.dataset_routes import dataset_bp
from routes.ml_routes import ml_bp
from routes.rag_routes import rag_bp
from routes.agent_routes import agent_bp
from routes.evaluator_routes import evaluator_bp

app = Flask(__name__)
# Hanya bolehkan akses dari frontend jika di production (bisa disesuaikan nanti)
CORS(app)

# Inisialisasi Database (Pool)
init_db()

# Buat folder jika belum ada
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

# Register Routes / Blueprints
app.register_blueprint(dataset_bp)
app.register_blueprint(ml_bp)
app.register_blueprint(rag_bp)
app.register_blueprint(agent_bp)
app.register_blueprint(evaluator_bp)

@app.route('/', methods=['GET'])
@app.route('/dashboard', methods=['GET'])
def index():
    return jsonify({
        "status": "success",
        "message": "Backend Prediksi Rumah AI + RAG LangChain Aktif (Modular Version)!"
    }), 200

# ====================================================
# MAIN RUNNER
# ====================================================
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, port=5000)