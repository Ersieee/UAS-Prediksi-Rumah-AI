import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from config import Config

def create_brosur_pdf():
    # Pastikan folder uploads ada
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(Config.UPLOAD_FOLDER, "brosur_perumahan.pdf")
    
    c = canvas.Canvas(file_path, pagesize=letter)
    
    text = c.beginText(50, 750)
    text.setFont("Helvetica-Bold", 16)
    text.textLine("BROSUR RESMI PERUMAHAN GRIYA PERMAI RESIDENCE")
    text.setFont("Helvetica", 10)
    text.textLine("==================================================================")
    text.textLine("")
    
    content = [
        "1. LOKASI PERUMAHAN",
        "   Jl. Mawar Asri No. 88, Cibubur, Jakarta Timur.",
        "   Dekat dengan Pintu Tol Cibubur (5 menit) dan Stasiun LRT (10 menit).",
        "",
        "2. TIPE RUMAH & HARGA",
        "   - Tipe 36/60 (2 Kamar Tidur, 1 Kamar Mandi): Rp 450.000.000",
        "   - Tipe 45/84 (2 Kamar Tidur, 1 Kamar Mandi, Carport): Rp 650.000.000",
        "   - Tipe 70/120 (3 Kamar Tidur, 2 Kamar Mandi, 2 Lantai): Rp 1.100.000.000",
        "",
        "3. FASILITAS PERUMAHAN",
        "   - One Gate System & Keamanan 24 Jam (CCTV)",
        "   - Kolam Renang dan Taman Bermain Anak",
        "   - Masjid dan Lapangan Olahraga",
        "   - Bebas Banjir dan Listrik Underground (Underground Cable)",
        "",
        "4. PROMO KHUSUS BULAN INI",
        "   - DP 0% (Tanpa Uang Muka)",
        "   - Gratis Biaya KPR, BPHTB, Notaris, dan BBN",
        "   - Gratis 1 Unit AC 1/2 PK dan Smart Door Lock untuk Tipe 45 & 70",
        "",
        "5. SYARAT KPR BANK",
        "   - Fotokopi KTP (Suami/Istri), NPWP, dan Kartu Keluarga",
        "   - Slip Gaji 3 Bulan Terakhir atau Surat Keterangan Usaha (SKU)",
        "   - Rekening Koran 3 Bulan Terakhir",
        "   - Usia minimal 21 tahun dan maksimal 55 tahun saat tenor berakhir",
        "",
        "CONTACT PERSON / MARKETING:",
        "Telepon/WhatsApp: 0812-3456-7890 (Bapak Budi)",
        "Website: www.griyapermairesidence.com"
    ]
    
    for line in content:
        if line.startswith(("1.", "2.", "3.", "4.", "5.", "CONTACT")):
            text.setFont("Helvetica-Bold", 12)
        else:
            text.setFont("Helvetica", 10)
        text.textLine(line)
        
    c.drawText(text)
    c.save()
    
    return file_path
