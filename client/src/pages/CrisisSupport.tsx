import { useState, useRef, useEffect } from 'react';
import { auth } from '../firebase';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    isCrisis?: boolean;
}

const QUICK_REPLIES = [
    { label: "😟 I feel stressed", text: "I'm feeling really stressed right now and I don't know how to handle it." },
    { label: "😵 I can't focus", text: "I can't seem to focus on anything. My mind keeps wandering and I'm falling behind." },
    { label: "😴 I feel exhausted", text: "I'm completely exhausted but I can't rest because of all my deadlines." },
    { label: "😰 I'm overwhelmed", text: "Everything feels overwhelming. I have too much to do and no energy to do any of it." },
];

const FALLBACK_RESPONSES = [
    "I hear you, and what you're feeling is completely valid. When we're at our limit, even small steps feel huge. What's the one thing weighing on you the most right now?",
    "That sounds really tough. You don't have to carry this alone. Let's break this down together — what feels most urgent to you?",
    "Thank you for sharing that with me. It takes courage. Can you tell me a bit more about what's been going on?",
];

const CrisisSupport = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi, I'm Aria 👋 — your AI wellness companion. This is a safe space. I'm here to listen without judgment, help you process what you're feeling, and guide you toward support. How are you doing today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCrisisPanel, setShowCrisisPanel] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = async (overrideText?: string) => {
        const textToSend = overrideText || inputText;
        if (!textToSend.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            const token = await auth.currentUser?.getIdToken();
            
            // Send full history for context
            const historyForContext = messages.slice(-8);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({
                        message: textToSend,
                        history: historyForContext
                    })
                }
            );

            let responseText: string;
            let isCrisis = false;

            if (response.ok) {
                const data = await response.json();
                responseText = data.response;
                isCrisis = data.isCrisis || false;
            } else {
                responseText = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
            }

            if (isCrisis) setShowCrisisPanel(true);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date(),
                isCrisis
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const fallback: Message = {
                id: (Date.now() + 1).toString(),
                text: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, fallback]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto">
            {/* Header Card */}
            <div className="flex items-center gap-4 p-4 mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <h2 className="font-bold text-slate-800">Aria — AI Wellness Companion</h2>
                    <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Online · 24/7 Support
                    </p>
                </div>
                <button
                    onClick={() => setShowCrisisPanel(!showCrisisPanel)}
                    className="ml-auto px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">emergency</span>
                    Crisis Lines
                </button>
            </div>

            {/* Crisis Escalation Panel */}
            {showCrisisPanel && (
                <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                    <h3 className="font-bold text-rose-700 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">crisis_alert</span>
                        Immediate Help Resources
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                            { label: "🇺🇸 Suicide & Crisis Lifeline", value: "Call/Text 988" },
                            { label: "💬 Crisis Text Line", value: "Text HOME to 741741" },
                            { label: "🌍 International Association", value: "findahelpline.com" },
                            { label: "🏥 Emergency Services", value: "Call 911" },
                        ].map(r => (
                            <div key={r.label} className="bg-white rounded-xl p-3 border border-rose-100">
                                <p className="text-xs font-semibold text-slate-700">{r.label}</p>
                                <p className="text-sm font-bold text-rose-600">{r.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0 mb-1">
                                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                            </div>
                        )}
                        <div className={`max-w-[80%] flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-sm'
                                    : msg.isCrisis
                                        ? 'bg-rose-50 border border-rose-200 text-slate-800 rounded-bl-sm'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                            }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                        </div>
                        <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
                {QUICK_REPLIES.map(qr => (
                    <button
                        key={qr.label}
                        onClick={() => handleSend(qr.text)}
                        disabled={loading}
                        className="flex-shrink-0 px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50"
                    >
                        {qr.label}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 flex gap-3 shadow-sm">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Share what's on your mind..."
                    disabled={loading}
                    className="flex-1 bg-transparent text-slate-700 placeholder-slate-400 text-sm focus:outline-none disabled:opacity-50"
                />
                <button
                    onClick={() => handleSend()}
                    disabled={loading || !inputText.trim()}
                    className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-sm shadow-indigo-200 flex-shrink-0"
                >
                    <span className="material-symbols-outlined text-lg">send</span>
                </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
                Not a substitute for professional mental health care. In emergencies, call 988 or 911.
            </p>
        </div>
    );
};

export default CrisisSupport;
