import React, { useState } from 'react';

// Tipe data untuk pesan chat
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export const Assistant: React.FC = () => {
  // 1. State untuk menyimpan daftar pesan chat
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Halo! Ada yang bisa saya bantu terkait informasi properti atau brosur rumah?' }
  ]);

  // 2. State untuk teks yang sedang diketik user
  const [inputUser, setInputUser] = useState<string>('');

  // 3. State penanda loading (saat AI sedang berpikir)
  const [loading, setLoading] = useState<boolean>(false);

  // 4. Fungsi Utama Kirim Pesan RAG
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Mencegah reload halaman jika pakai <form>

    if (!inputUser.trim()) return; // Jangan kirim jika teks kosong

    const userText = inputUser;
    
    // Tampilkan pesan user ke layar & kosongkan kolom input
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputUser('');
    setLoading(true);

    try {
      // Panggil API Backend RAG Flask
      const response = await fetch('http://localhost:5000/api/chat-rag', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      if (response.ok) {
        // Tampilkan balasan AI dari RAG ke layar
        setMessages((prev) => [
          ...prev, 
          { sender: 'bot', text: data.response || data.reply || 'Tidak ada respons dari AI.' }
        ]);
      } else {
        // Tampilkan pesan error jika server bermasalah
        setMessages((prev) => [
          ...prev, 
          { sender: 'bot', text: ` Error: ${data.error || 'Gagal terhubung ke AI Assistant.'}` }
        ]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setMessages((prev) => [
        ...prev, 
        { sender: 'bot', text: 'Gagal menghubungi server backend. Pastikan `python app.py` sedang berjalan.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>🤖 AI Real Estate Assistant (RAG)</h2>
      
      {/* Container Pesan Chat */}
      <div style={{ height: '350px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            style={{ 
              textAlign: msg.sender === 'user' ? 'right' : 'left', 
              margin: '8px 0' 
            }}
          >
            <span 
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '12px',
                backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
                color: msg.sender === 'user' ? '#fff' : '#333'
              }}
            >
              <strong>{msg.sender === 'user' ? 'Anda: ' : 'AI: '}</strong>
              {msg.text}
            </span>
          </div>
        ))}

        {loading && <p style={{ fontStyle: 'italic', color: '#888' }}>AI sedang membaca dokumen & mengetik...</p>}
      </div>

      {/* Form Input Pesan */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputUser}
          onChange={(e) => setInputUser(e.target.value)}
          placeholder="Tanyakan isi brosur/lokasi/harga..."
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? '...' : 'Kirim'}
        </button>
      </form>
    </div>
  );
};

export default Assistant;