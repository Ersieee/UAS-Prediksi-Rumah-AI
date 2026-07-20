from flask import Blueprint, request, jsonify
import traceback
from services.ml_service import train_linear_regression, predict_house_price
from services.database import get_db_connection

ml_bp = Blueprint('ml_bp', __name__)

@ml_bp.route('/train', methods=['POST'])
def train_model():
    try:
        res, err = train_linear_regression()
        if err or res is None:
            return jsonify({"status": "error", "message": err}), 400

        return jsonify({
            "status": "success",
            "message": "Model berhasil dilatih dan disimpan!",
            "jumlah_data": res["jumlah_data"],
            "r2_score": res["r2_score"],
            "mae": res["mae"],
            "rmse": res["rmse"]
        }), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": f"Gagal melatih model: {str(e)}"
        }), 400

@ml_bp.route('/predict', methods=['POST'])
def predict_price():
    try:
        data = request.get_json() or {}

        luas_tanah = (
            data.get('luas_tanah') or 
            data.get('luas') or 
            data.get('area') or 
            data.get('LotArea') or 
            data.get('input_luas')
        )

        if luas_tanah is None or str(luas_tanah).strip() == '':
            return jsonify({
                "status": "error",
                "message": "Nilai luas tanah wajib diisi!"
            }), 400

        try:
            luas_val = float(luas_tanah)
        except ValueError:
            return jsonify({
                "status": "error",
                "message": "Nilai luas tanah harus berupa angka."
            }), 400

        pred_price, err = predict_house_price(luas_val)
        
        if err:
            return jsonify({
                "status": "error",
                "message": err
            }), 400

        return jsonify({
            "status": "success",
            "message": "Prediksi berhasil!",
            "prediksi": pred_price,
            "predicted_price": pred_price,
            "harga_prediksi": pred_price,
            "result": pred_price,
            "harga": pred_price
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": f"Gagal melakukan prediksi: {str(e)}"
        }), 500


@ml_bp.route('/history', methods=['GET'])
@ml_bp.route('/api/history', methods=['GET'])
def get_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, luas_tanah, harga_prediksi, created_at FROM riwayat_prediksi ORDER BY id DESC")
        rows = cursor.fetchall()
        cursor.close()
        # Return connection back to pool
        conn.close()

        history_list = []
        for r in rows:
            tgl_str = str(r["created_at"])
            history_list.append({
                "id": r["id"],
                "luas_tanah": r["luas_tanah"],
                "luas": r["luas_tanah"],
                "harga_prediksi": r["harga_prediksi"],
                "harga": r["harga_prediksi"],
                "predicted_price": r["harga_prediksi"],
                "prediksi": r["harga_prediksi"],
                "tanggal": tgl_str,
                "created_at": tgl_str,
                "date": tgl_str
            })

        return jsonify(history_list), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify([]), 200


@ml_bp.route('/history', methods=['DELETE'])
@ml_bp.route('/history/clear', methods=['DELETE', 'POST'])
def clear_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("TRUNCATE TABLE riwayat_prediksi")
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Riwayat berhasil dihapus!"}), 200
    except Exception as e:
        return jsonify({"message": f"Gagal menghapus riwayat: {str(e)}"}), 500
