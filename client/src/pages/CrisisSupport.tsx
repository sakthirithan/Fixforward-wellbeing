import { useState } from 'react';
import { auth } from '../firebase';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

const CrisisSupport = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello. I'm your AI wellness companion. I'm here to listen and support you. How are you feeling today?", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: inputText })
            });

            if (response.ok) {
                const data = await response.json();
                const aiMsg: Message = { id: (Date.now() + 1).toString(), text: data.response, sender: 'ai' };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                const aiMsg: Message = { id: (Date.now() + 1).toString(), text: "I'm having trouble connecting right now, but I'm still here for you. Please try again or reach out to a professional counselor.", sender: 'ai' };
                setMessages(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto bg-surface-container-lowest rounded-[2.5rem] shadow-xl overflow-hidden border border-black/[0.03]">
            {/* Header */}
            <div className="p-6 bg-primary text-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <div>
                    <h2 className="font-headline font-bold text-xl">Crisis Support AI</h2>
                    <p className="text-xs opacity-80 uppercase tracking-widest font-bold">24/7 Empathetic Companion</p>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-primary/5 to-transparent">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm ${
                            msg.sender === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-white text-on-surface rounded-tl-none border border-black/[0.05]'
                        }`}>
                            <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-black/[0.05] flex gap-2">
                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-black/[0.05]">
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 bg-surface-container rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
                <p className="text-[10px] text-on-surface-variant text-center mt-4 uppercase tracking-tighter font-bold">
                    This is an AI companion for emotional support. In a life-threatening emergency, please call 911 or your local emergency services.
                </p>
            </div>
        </div>
    );
};

export default CrisisSupport;
