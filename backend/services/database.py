import mysql.connector
from mysql.connector import pooling
from config import Config
import sys

# Create connection pool
db_pool = None

def init_pool():
    global db_pool
    try:
        db_pool = pooling.MySQLConnectionPool(
            pool_name="mypool",
            pool_size=5,
            pool_reset_session=True,
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DB
        )
    except mysql.connector.Error as err:
        print(f"ERROR DB POOL: {err}")
        # Don't exit if DB fails, allow app to run so other endpoints work
        pass

def get_db_connection():
    global db_pool
    if db_pool is None:
        init_pool()
    try:
        if db_pool:
            return db_pool.get_connection()
    except Exception as e:
        print(f"Error getting connection from pool: {e}")
    
    # Fallback to direct connection if pool fails
    return mysql.connector.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB
    )

def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS riwayat_prediksi (
                id INT AUTO_INCREMENT PRIMARY KEY,
                luas_tanah DOUBLE NOT NULL,
                harga_prediksi DOUBLE NOT NULL,
                created_at DATETIME NOT NULL
            )
        ''')
        conn.commit()
        cursor.close()
        conn.close()
        print("\n==================================================")
        print(f"SUCCESS: Terhubung ke Database '{Config.MYSQL_DB}' dengan Pooling!")
        print("Tabel 'riwayat_prediksi' Siap!")
        print("==================================================\n")
    except Exception as e:
        print("\n==================================================")
        print("ERROR KONEKSI MYSQL:")
        print(f"Detail Error: {str(e)}")
        print("==================================================\n")
