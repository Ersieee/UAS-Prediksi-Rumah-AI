import os
from config import Config
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Inisialisasi embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def process_and_store_document(file_path):
    """Membaca PDF/Text, memotong teks, di-embedding, lalu disimpan ke Chroma Vector DB"""
    if file_path.endswith('.pdf'):
        loader = PyPDFLoader(file_path)
    else:
        loader = TextLoader(file_path, encoding='utf-8')
        
    documents = loader.load()

    # Split Teks menjadi potongan (Chunks)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(documents)

    # Simpan Embeddings ke Vector DB (ChromaDB)
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=Config.CHROMA_PATH
    )
    return len(chunks)

def answer_question_with_rag(query_text):
    """Mencari konteks di ChromaDB dan dijawab oleh Groq LLM (Llama 3) menggunakan LCEL"""
    if not os.path.exists(Config.CHROMA_PATH):
        return "Belum ada dokumen brosur yang diunggah ke Vector DB. Silakan unggah dokumen PDF di menu Dataset/Brosur."

    vector_db = Chroma(persist_directory=Config.CHROMA_PATH, embedding_function=embeddings)
    retriever = vector_db.as_retriever(search_kwargs={"k": 3})

    # Inisialisasi LLM
    llm = ChatGroq(
        temperature=0.2, 
        groq_api_key=Config.GROQ_API_KEY, 
        model_name="llama-3.3-70b-versatile"
    )

    system_prompt = (
        "Anda adalah AI Real Estate Assistant profesional. "
        "Gunakan potongan konteks dokumen berikut untuk menjawab pertanyaan pengguna. "
        "Jika informasi tidak terdapat dalam dokumen, katakan bahwa informasi tidak ditemukan dalam brosur. "
        "Jawablah dengan sopan, akurat, dan jelas dalam bahasa Indonesia.\n\n"
        "Konteks Dokumen:\n{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    response = rag_chain.invoke(query_text)
    return response
