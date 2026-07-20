import os
import pickle
import traceback
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from config import Config
from services.database import get_db_connection

def load_and_prepare_dataset():
    if not os.path.exists(Config.DATASET_FILE):
        return None, "Dataset belum diunggah! Silakan unggah file CSV di menu Dataset."

    df = None
    for sep in [',', ';', '\t']:
        try:
            temp_df = pd.read_csv(Config.DATASET_FILE, sep=sep)
            if len(temp_df.columns) > 1:
                df = temp_df
                break
        except Exception:
            continue

    if df is None:
        try:
            df = pd.read_csv(Config.DATASET_FILE, engine='python')
        except Exception as e:
            return None, f"Gagal membaca file CSV: {str(e)}"

    cols = list(df.columns)
    luas_col = None
    harga_col = None

    for c in cols:
        c_lower = str(c).lower().strip()
        if any(k in c_lower for k in ['luas', 'lot', 'area', 'size']):
            luas_col = c
        elif any(k in c_lower for k in ['harga', 'price', 'sale', 'cost']):
            harga_col = c

    if not luas_col:
        luas_col = cols[0]
    if not harga_col:
        harga_col = cols[1] if len(cols) > 1 else cols[0]

    def clean_val(series):
        s_str = series.astype(str).str.replace(r'[^0-9]', '', regex=True)
        return pd.to_numeric(s_str, errors='coerce').fillna(0)

    df_clean = df.copy()
    df_clean[luas_col] = clean_val(df_clean[luas_col])
    df_clean[harga_col] = clean_val(df_clean[harga_col])

    df_valid = df_clean[(df_clean[luas_col] > 0) & (df_clean[harga_col] > 0)].copy()

    return {
        "df": df_valid,
        "luas_col": luas_col,
        "harga_col": harga_col,
        "total_raw": len(df)
    }, None

def train_linear_regression():
    res, err = load_and_prepare_dataset()
    if err or res is None:
        return None, err

    df_valid = res["df"]
    luas_col = res["luas_col"]
    harga_col = res["harga_col"]

    if len(df_valid) < 2:
        return None, f"Data valid hanya ada {len(df_valid)} baris. Minimal dibutuhkan 2 baris."

    X = df_valid[[luas_col]]
    y = df_valid[harga_col]

    n_samples = len(df_valid)
    test_size = 1 if n_samples < 5 else 0.2

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42
    )

    model = LinearRegression()
    model.fit(X_train, y_train)

    with open(Config.MODEL_FILE, 'wb') as f:
        pickle.dump({
            "model": model,
            "luas_col": luas_col,
            "harga_col": harga_col
        }, f)

    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)

    if np.isnan(r2):
        r2 = 0.0

    return {
        "jumlah_data": n_samples,
        "r2_score": round(float(r2), 4),
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2)
    }, None

def predict_house_price(luas_val):
    if not os.path.exists(Config.MODEL_FILE):
        return None, "Model AI belum dilatih. Silakan buka menu Training AI terlebih dahulu!"

    with open(Config.MODEL_FILE, 'rb') as f:
        saved_data = pickle.load(f)
        model = saved_data["model"]

    pred_array = model.predict([[luas_val]])
    pred_price = round(float(pred_array[0]), 2)
    if pred_price < 0:
        pred_price = 0.0

    # SIMPAN KE TABEL riwayat_prediksi PHPMYADMIN
    waktu_sekarang = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO riwayat_prediksi (luas_tanah, harga_prediksi, created_at) VALUES (%s, %s, %s)"
        cursor.execute(query, (luas_val, pred_price, waktu_sekarang))
        conn.commit()
        cursor.close()
        conn.close()
        print("Data berhasil disimpan ke MySQL riwayat_prediksi!")
    except Exception as db_err:
        print("Gagal menyimpan ke MySQL:", db_err)

    return pred_price, None
