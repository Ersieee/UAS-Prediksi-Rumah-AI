import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DB = os.getenv("MYSQL_DB", "prediksi_rumah_ai")
    
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    DATASET_FILE = os.path.join(UPLOAD_FOLDER, 'dataset.csv')
    MODEL_FILE = os.path.join(BASE_DIR, 'model.pkl')
    CHROMA_PATH = os.path.join(BASE_DIR, 'chroma_db')
