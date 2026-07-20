import joblib

model = joblib.load("model/model.pkl")

luas = [[100]]

hasil = model.predict(luas)

print("========================")
print("HASIL PREDIKSI")
print("========================")
print(f"Harga Rumah : Rp {hasil[0]:,.0f}")