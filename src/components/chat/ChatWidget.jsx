import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, RotateCcw } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, isFirebaseEnabled } from '../../firebase/config';
import './ChatWidget.css';

// Quick suggestion chips
const SUGGESTIONS = [
  '📚 Xem đồ án mẫu',
  '💻 Phần mềm cơ khí',
  '🛒 Hướng dẫn mua file',
  '📞 Liên hệ Admin',
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Chào bạn! 👋 Mình là trợ lý tự động của **MechanicalBKA**.\n\nVì hệ thống AI đang bảo trì, mình sẽ hỗ trợ bạn dựa trên các từ khóa (ví dụ: **đồ án**, **phần mềm**, **khóa học**, **thanh toán**...). Bạn cần mình giúp gì nào?' }
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
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen]);

  // Hàm xử lý logic Bot tự động (Rule-based)
  const getBotResponse = (userInput) => {
    const text = userInput.toLowerCase();
    
    if (text.includes('đồ án') || text.includes('bản vẽ') || text.includes('chi tiết máy')) {
      return 'Bên mình cung cấp đa dạng các loại đồ án (Hộp giảm tốc, Truyền động cơ khí, Đồ án tốt nghiệp...). Bạn có thể bấm vào mục **ĐỒ ÁN CHI TIẾT MÁY** trên thanh menu để xem chi tiết nhé!';
    }
    if (text.includes('phần mềm') || text.includes('cad') || text.includes('solidworks') || text.includes('inventor') || text.includes('nx') || text.includes('autocad')) {
      return 'Để tải các phần mềm chuyên ngành cơ khí (AutoCAD, SolidWorks, NX, Inventor...), bạn hãy vào mục **KHO FILE** > **Phần mềm** trên website nhé. Các link tải đều miễn phí và có hướng dẫn cài đặt.';
    }
    if (text.includes('khóa học') || text.includes('dạy') || text.includes('học')) {
      return 'MechanicalBKA có các khóa học thực chiến về thiết kế cơ khí. Bạn truy cập vào tab **KHÓA HỌC** ở thanh menu để tham khảo lộ trình và học phí nha.';
    }
    if (text.includes('mua') || text.includes('thanh toán') || text.includes('nạp') || text.includes('giá')) {
      return 'Để mua tài liệu hoặc bản vẽ VIP, bạn cần đăng nhập tài khoản, nạp xu vào ví (thanh toán qua chuyển khoản quét mã QR tự động) và sau đó click vào nút "Tải xuống" ở file tương ứng nhé.';
    }
    if (text.includes('liên hệ') || text.includes('admin') || text.includes('zalo') || text.includes('lỗi') || text.includes('support') || text.includes('sđt') || text.includes('số điện thoại') || text.includes('email')) {
      return 'Nếu gặp lỗi hoặc cần hỗ trợ trực tiếp, bạn vui lòng liên hệ Admin nhé!\n📞 **SĐT/Zalo:** 0862990403\n📧 **Email:** trongme2bka@gmail.com';
    }
    if (text.includes('youtube') || text.includes('video') || text.includes('kênh')) {
      return 'Bạn có thể xem các video hướng dẫn chi tiết về cơ khí trên kênh YouTube của mình nhé!\n👉 **Kênh YouTube:** [youtube.com/@trongbka](https://youtube.com/@trongbka)';
    }
    if (text.includes('tham khảo') || text.includes('nguồn') || text.includes('epxyz') || text.includes('vertanux')) {
      return 'Đây là một số nguồn tài liệu và kênh YouTube tham khảo cực kỳ hữu ích:\n- **Vertanux1:** [youtube.com/@vertanux1](https://youtube.com/@vertanux1) | [vertanux1.com](http://www.vertanux1.com)\n- **Engineering Paper:** [youtube.com/@epxyz](https://youtube.com/@epxyz) | [engineeringpaper.xyz](https://engineeringpaper.xyz) | [blog](https://blog.engineeringpaper.xyz)';
    }
    if (text.includes('web cũ') || text.includes('bản cũ') || text.includes('website')) {
      return 'Website cũ của dự án được host tại: [mechanicalbka-web.vercel.app](https://mechanicalbka-web.vercel.app/).\nBản hiện tại đang chạy ở: http://localhost:5173/';
    }
    if (text.includes('latex') || text.includes('overleaf')) {
      return 'Để soạn thảo văn bản hoặc báo cáo bằng LaTeX, bạn có thể sử dụng [Overleaf](https://www.overleaf.com/login).';
    }
    if (text.includes('tài liệu') || text.includes('file') || text.includes('báo cáo')) {
      return 'Bên mình có rất nhiều tài liệu, báo cáo, và file tính toán kỹ thuật định dạng **Engineering Paper (.epxyz)**. Bạn hãy truy cập mục **KHO FILE** để tìm kiếm tài liệu mình cần nha.';
    }
    if (text.includes('pass') || text.includes('mật khẩu') || text.includes('giải nén')) {
      return 'Mật khẩu giải nén file (nếu có) thường mặc định là **16042003**. Nếu giải nén vẫn bị lỗi, bạn liên hệ qua Zalo (0862990403) để Admin hỗ trợ nhé.';
    }
    if (text.includes('chào') || text.includes('hello') || text.includes('hi')) {
      return 'Chào bạn! Chúc bạn một ngày học tập và làm việc hiệu quả. Bạn cần mình tư vấn về đồ án hay phần mềm?';
    }
    if (text.includes('cảm ơn') || text.includes('thanks') || text.includes('tuyệt') || text.includes('ok')) {
      return 'Không có gì đâu nè! MechanicalBKA luôn đồng hành cùng sinh viên cơ khí! ❤️';
    }

    // Câu trả lời mặc định nếu không khớp từ khóa nào
    return 'Xin lỗi, mình là bot tự động nên hiện chỉ hiểu được một số từ khóa chính (như: **đồ án**, **phần mềm**, **khóa học**, **liên hệ**...). \n\nĐể được giải đáp chi tiết hơn câu hỏi này, bạn vui lòng nhắn tin trực tiếp qua Zalo cho admin nhé!';
  };

  const processMessage = async (userText) => {
    // Thêm tin nhắn của User
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      if (isFirebaseEnabled && app) {
        const functions = getFunctions(app, 'asia-southeast1');
        const chatAPI = httpsCallable(functions, 'chatAPI');
        // Map history safely
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        const result = await chatAPI({ message: userText, history });
        const botReply = result.data.response;
        setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: botReply }]);
      } else {
        // Giả lập độ trễ (typing) cho giống người thật (từ 0.5s đến 1.5s)
        const delay = Math.random() * 1000 + 500;
        setTimeout(() => {
          const botReply = getBotResponse(userText);
          setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: botReply }]);
          setIsLoading(false);
        }, delay);
        return;
      }
    } catch (error) {
      console.error('[ChatWidget] Error calling chatAPI:', error);
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: 'Xin lỗi, hệ thống RAG đang gặp sự cố. Bạn vui lòng liên hệ trực tiếp Admin (0862990403) để được hỗ trợ nhé.' }]);
    }
    
    setIsLoading(false);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    processMessage(userMessage);
  };

  const handleSuggestionClick = (suggestion) => {
    const text = suggestion.replace(/^[^\s]+\s/, ''); // Remove emoji prefix
    setInput('');
    processMessage(text);
  };

  const handleReset = () => {
    setMessages([
      { id: Date.now(), role: 'bot', text: 'Chào bạn! 👋 Mình là trợ lý tự động của **MechanicalBKA**.\n\nVì hệ thống AI đang bảo trì, mình sẽ hỗ trợ bạn dựa trên các từ khóa (ví dụ: **đồ án**, **phần mềm**, **khóa học**, **thanh toán**...). Bạn cần mình giúp gì nào?' }
    ]);
    setShowSuggestions(true);
    setInput('');
  };

  // Simple markdown-like rendering for bold text
  const renderText = (text) => {
    // Handle newlines
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="chat-widget-container">
      {/* Chat Window */}
      <div className={`chat-window ${!isOpen ? 'hidden' : ''}`}>
        <div className="chat-header">
          <div className="chat-title">
            <Sparkles size={18} />
            <span>Trợ lý MechanicalBKA</span>
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
            placeholder="Nhập từ khóa (đồ án, phần mềm)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
            <Send size={18} />
          </button>
        </form>
        <div className="chat-powered">Hệ thống trả lời tự động</div>
      </div>

      {/* Floating Action Button */}
      {!isOpen && (
        <button className="chat-fab" onClick={() => setIsOpen(true)} aria-label="Mở trợ lý">
          <MessageCircle size={26} />
          <span className="fab-pulse"></span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
