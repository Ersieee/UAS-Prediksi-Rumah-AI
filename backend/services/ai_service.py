def generate_insight(luas, harga):
    return f"""
Rumah dengan luas tanah {luas:.0f} m² diperkirakan memiliki harga sekitar Rp {harga:,.0f}.

Prediksi ini dihasilkan menggunakan model Linear Regression.

Semakin besar luas tanah, maka harga rumah cenderung meningkat.

Perlu diketahui bahwa prediksi ini merupakan estimasi berdasarkan dataset pelatihan dan tidak memperhitungkan faktor lain seperti lokasi, umur bangunan, fasilitas, maupun kondisi pasar saat ini.
"""
