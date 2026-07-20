import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="prediksi_rumah_ai"
)

cursor = db.cursor()