from flask import Blueprint, request, jsonify, send_file
import traceback
import os
from config import Config
from services.ml_service import load_and_prepare_dataset
from services.pdf_service import create_brosur_pdf

dataset_bp = Blueprint('dataset_bp', __name__)

@dataset_bp.route('/upload', methods=['POST'])
def upload_dataset():
    file = request.files.get('file') or request.files.get('dataset')

    if not file or file.filename == '':
        return jsonify({"message": "File tidak ditemukan."}), 400

    if not file.filename.lower().endswith('.csv'):
        return jsonify({"message": "Format file harus berekstensi .csv!"}), 400

    try:
        file.save(Config.DATASET_FILE)
        res, err = load_and_prepare_dataset()
        if err:
            return jsonify({"message": f"File tersimpan, namun warning: {err}"}), 200

        return jsonify({
            "message": "Dataset CSV berhasil diunggah!",
            "total_rows": res["total_raw"]
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": f"Gagal memproses berkas CSV: {str(e)}"}), 500


@dataset_bp.route('/dataset', methods=['GET'])
def get_dataset():
    res, err = load_and_prepare_dataset()
    if err or res is None:
        return jsonify({
            "data": [],
            "total_rows": 0,
            "avg_luas": 0,
            "avg_harga": 0
        }), 200

    df_valid = res["df"]
    luas_col = res["luas_col"]
    harga_col = res["harga_col"]

    avg_luas = round(float(df_valid[luas_col].mean()), 1) if len(df_valid) > 0 else 0
    avg_harga = round(float(df_valid[harga_col].mean()), 0) if len(df_valid) > 0 else 0

    preview_df = df_valid.head(100)
    data_list = []
    for _, row in preview_df.iterrows():
        data_list.append({
            "luas_tanah": int(row[luas_col]),
            "harga": int(row[harga_col])
        })

    return jsonify({
        "data": data_list,
        "total_rows": res["total_raw"],
        "avg_luas": avg_luas,
        "avg_harga": avg_harga
    }), 200

@dataset_bp.route('/download-brosur', methods=['GET'])
def download_brosur():
    try:
        # Generate PDF baru atau timpa yang lama
        pdf_path = create_brosur_pdf()
        
        # Kirim file PDF sebagai attachment (agar otomatis terunduh di browser)
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='Brosur_Griya_Permai.pdf'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": f"Gagal membuat PDF: {str(e)}"}), 500
