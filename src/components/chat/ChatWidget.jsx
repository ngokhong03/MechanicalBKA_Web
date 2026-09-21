import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, RotateCcw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import './ChatWidget.css';

const SYSTEM_PROMPT = `Bạn là trợ lý ảo AI của MechanicalBKA — nền tảng cung cấp tài liệu, đồ án cơ khí, phần mềm và khóa học chuyên ngành cơ khí.

Thông tin về website MechanicalBKA:
- Trang chủ: mechanicalbka-web.vercel.app
- Có các mục: Đồ Án (Hộp giảm tốc, bản vẽ, tính toán), Chuyên Ngành, Phần Mềm, Khóa Học, Kho File Kỹ Thuật (CAD, Excel, bản vẽ), Videos
- Hỗ trợ thanh toán online cho file kỹ thuật
- Dành cho sinh viên và kỹ sư cơ khí Việt Nam

Quy tắc trả lời:
1. Luôn trả lời bằng tiếng Việt
2. Thái độ thân thiện, chuyên nghiệp, ngắn gọn súc tích
3. Khi người dùng hỏi về sản phẩm/khóa học, hướng dẫn họ đến đúng trang
4. Có thể giải đáp kiến thức cơ khí cơ bản (sức bền vật liệu, chi tiết máy, vẽ kỹ thuật...)
5. Nếu không biết câu trả lời, hãy thành thật và gợi ý liên hệ admin`;

// Fallback models ordered by preference
const MODELS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.6-flash'];

// Quick suggestion chips
const SUGGESTIONS = [
  '📚 Xem đồ án mẫu',
  '💻 Phần mềm cơ khí',
  '🛒 Hướng dẫn mua file',
  '❓ Hỏi kiến thức cơ khí',
];

// Khởi tạo Gemini client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Chào bạn! 👋 Mình là trợ lý AI của **MechanicalBKA**. Mình có thể giúp bạn tìm tài liệu, đồ án, hoặc giải đáp kiến thức cơ khí. Hãy thử hỏi mình nhé!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen]);

  // Try calling Gemini with fallback models
  const callGemini = async (contents) => {
    let lastError = null;
    for (const model of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
          }
        });
        return response.text;
      } catch (error) {
        lastError = error;
        // If it's a 503 (overloaded) or 404 (not found), try next model
        if (error.message?.includes('503') || error.message?.includes('404') || error.message?.includes('UNAVAILABLE') || error.message?.includes('NOT_FOUND')) {
          continue;
        }
        // For other errors (auth, etc.), throw immediately
        throw error;
      }
    }
    throw lastError;
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!ai) {
      setMessages(prev => [...prev,
        { id: Date.now(), role: 'user', text: input },
        { id: Date.now() + 1, role: 'error', text: 'Chưa cấu hình API Key. Vui lòng liên hệ admin.' }
      ]);
      setInput('');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setShowSuggestions(false);
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const contents = messages
        .filter(m => m.role !== 'error')
        .map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const botReply = await callGemini(contents);
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: botReply || 'Xin lỗi, mình không thể trả lời lúc này.' }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'error',
        text: 'Hệ thống AI đang bận. Vui lòng thử lại sau ít phút hoặc liên hệ admin qua Zalo nhé!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const text = suggestion.replace(/^[^\s]+\s/, ''); // Remove emoji prefix
    setInput(text);
    // Auto-send
    setTimeout(() => {
      setInput(text);
      const fakeEvent = { preventDefault: () => {} };
      setShowSuggestions(false);
      setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }]);
      setIsLoading(true);

      if (!ai) return;

      const contents = messages
        .filter(m => m.role !== 'error')
        .map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));
      contents.push({ role: 'user', parts: [{ text }] });

      callGemini(contents)
        .then(botReply => {
          setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: botReply || 'Xin lỗi, mình không thể trả lời lúc này.' }]);
        })
        .catch(() => {
          setMessages(prev => [...prev, { id: Date.now(), role: 'error', text: 'Hệ thống AI đang bận. Vui lòng thử lại sau ít phút.' }]);
        })
        .finally(() => {
          setIsLoading(false);
          setInput('');
        });
    }, 50);
  };

  const handleReset = () => {
    setMessages([
      { id: Date.now(), role: 'bot', text: 'Chào bạn! 👋 Mình là trợ lý AI của **MechanicalBKA**. Mình có thể giúp bạn tìm tài liệu, đồ án, hoặc giải đáp kiến thức cơ khí. Hãy thử hỏi mình nhé!' }
    ]);
    setShowSuggestions(true);
    setInput('');
  };

  // Simple markdown-like rendering for bold text
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="chat-widget-container">
      {/* Chat Window */}
      <div className={`chat-window ${!isOpen ? 'hidden' : ''}`}>
        <div className="chat-header">
          <div className="chat-title">
            <Sparkles size={18} />
            <span>Trợ lý AI MechanicalBKA</span>
          </div>
          <div className="chat-header-actions">
            <button className="header-action-btn" onClick={handleReset} aria-label="Làm mới cuộc trò chuyện" title="Làm mới">
              <RotateCcw size={16} />
            </button>
            <button className="header-action-btn" onClick={() => setIsOpen(false)} aria-label="Đóng chat">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.role}`}>
              {msg.role === 'bot' && (
                <div className="msg-avatar bot-avatar">
                  <Bot size={14} />
                </div>
              )}
              <div className="msg-content">
                {renderText(msg.text)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message bot">
              <div className="msg-avatar bot-avatar">
                <Bot size={14} />
              </div>
              <div className="msg-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}

          {showSuggestions && messages.length <= 1 && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="suggestion-chip" onClick={() => handleSuggestionClick(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-footer" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
            <Send size={18} />
          </button>
        </form>
        <div className="chat-powered">Powered by Gemini AI</div>
      </div>

      {/* Floating Action Button */}
      {!isOpen && (
        <button className="chat-fab" onClick={() => setIsOpen(true)} aria-label="Mở trợ lý AI">
          <MessageCircle size={26} />
          <span className="fab-pulse"></span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
