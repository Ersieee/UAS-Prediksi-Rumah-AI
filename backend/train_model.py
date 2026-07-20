import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression

# Membaca dataset
data = pd.read_csv("dataset/rumah.csv")

# Feature
X = data[["luas_tanah"]]

# Target
y = data["harga"]

# Membuat model
model = LinearRegression()

# Training
model.fit(X, y)

# Simpan model
joblib.dump(model, "model/model.pkl")

print("================================")
print("MODEL BERHASIL DITRAINING")
print("================================")