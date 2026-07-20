import pandas as pd

DATASET = "dataset/rumah.csv"


def analyze_prediction(luas, harga):
    df = pd.read_csv(DATASET)

    rata = float(df["harga"].mean())
    minimum = float(df["harga"].min())
    maksimum = float(df["harga"].max())

    if harga < rata:
        kategori = "lebih murah dibanding rata-rata dataset."
    elif harga > rata:
        kategori = "lebih mahal dibanding rata-rata dataset."
    else:
        kategori = "mendekati rata-rata dataset."

    return {
        "kategori": kategori,
        "harga_rata": float(round(rata, 2)),
        "harga_minimum": float(round(minimum, 2)),
        "harga_maksimum": float(round(maksimum, 2))
    }
