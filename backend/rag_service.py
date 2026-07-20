import os
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. DIREKTORI VECTOR DB (ChromaDB)
CHROMA_PATH = "./chroma_db"
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# 2. FUNGSI UNTUK PROSES DOKUMEN -> EMBEDDING -> VECTOR DB
def process_and_store_document(file_path):
    """
    Membaca dokumen, memotong teks, mengubah ke Embedding, 
    dan menyimpannya ke dalam Vector DB (ChromaDB)
    """
    if file_path.endswith('.pdf'):
        loader = PyPDFLoader(file_path)
    else:
        loader = TextLoader(file_path, encoding='utf-8')
        
    documents = loader.load()

    # Split Teks menjadi potongan-potongan (Chunks)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(documents)

    # Simpan Embeddings ke Vector DB (ChromaDB)
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PATH
    )
    return len(chunks)

# 3. FUNGSI RAG QUESTION-ANSWERING (AI ASSISTANT)
def answer_question_with_rag(query_text, groq_api_key):
    """
    Mencari informasi relevan di Vector DB (RAG) 
    dan dijawab oleh LLM (Groq / Llama 3)
    """
    if not os.path.exists(CHROMA_PATH):
        return "Belum ada dokumen yang diunggah ke Vector DB. Silakan unggah dokumen PDF brosur terlebih dahulu."

    # Load Vector DB yang sudah ada
    vector_db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)
    retriever = vector_db.as_retriever(search_kwargs={"k": 3})

    # Inisialisasi LLM via LangChain (Menggunakan Groq Llama3 - Gratis & Sangat Cepat)
    llm = ChatGroq(temperature=0.2, groq_api_key=groq_api_key, model_name="llama-3.3-70b-versatile")

    # System Prompt untuk Menghindari Halusinasi
    system_prompt = (
        "Anda adalah AI Real Estate Assistant profesional. "
        "Gunakan potongan konteks dokumen berikut untuk menjawab pertanyaan pengguna. "
        "Jika Anda tidak tahu jawabannya berdasarkan dokumen, katakan bahwa informasi tidak ditemukan dalam dokumen. "
        "Jawablah dengan sopan dan ramah dalam bahasa Indonesia.\n\n"
        "Konteks Dokumen:\n{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    response = rag_chain.invoke({"input": query_text})
    return response["answer"]