import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const Chat = () => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { 
    messages, 
    activeRoom, 
    setActiveRoom, 
    unreadCount, 
    chatRooms, 
    onlineUsers,
    addMessage, 
    getRoomMessages, 
    formatTime, 
    getUserDisplayName, 
    getMessageTypeIcon
  } = useChat();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      user: isAuthenticated ? (user?.firstName || user?.username || 'Anonymous') : 'Guest',
      message: newMessage,
      timestamp: new Date().toISOString(),
      room: activeRoom,
      type: 'user'
    };

    addMessage(message);
    setNewMessage('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response for demo
    if (activeRoom === 'support') {
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          user: 'AI Assistant',
          message: getLocalizedText(
            'ጥያቄዎን ተቀብለናል። ቶሎ ምላሽ እንሰጣለን።',
            'We have received your question. We will respond shortly.',
            'Gaaffii kee fudhanneerra. Deebii gabaabatti kennina.',
            language
          ),
          timestamp: new Date().toISOString(),
          room: activeRoom,
          type: 'bot'
        };
        addMessage(botResponse);
        setIsTyping(false);
      }, 1500);
    } else {
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
        title={getLocalizedText('ውይይት ክፈት',  'Open Chat',  language)}
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">
            {getLocalizedText('ውይይት',  'Chat',  language)}
          </h3>
          <span className="bg-green-500 text-xs px-2 py-1 rounded-full">
            {onlineUsers.filter(u => u.status === 'online').length} {getLocalizedText('መስመር ላይ',  'online',  language)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-700 p-1 rounded"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-blue-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Room Selector */}
          <div className="flex border-b bg-gray-50 overflow-x-auto">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`flex-1 p-3 text-sm font-medium border-b-2 transition-colors min-w-0 ${
                  activeRoom === room.id
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title={room.description ? getLocalizedText(room.description.amharic,  room.description.english,  language) : ''}
              >
                <div className="flex items-center space-x-1">
                  <span>{room.icon}</span>
                  <span className="truncate">
                    {getLocalizedText(room.name.amharic,  room.name.english,  language)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {getRoomMessages().map((message) => (
              <div key={message.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    message.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    message.type === 'bot' ? 'bg-green-100 text-green-600' :
                    message.type === 'support' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {getMessageTypeIcon(message.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {getUserDisplayName(message)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-500">
                    {getLocalizedText('እየጻፈ ነው...',  'Typing...',  language)}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            {!isAuthenticated && (
              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                {getLocalizedText(
                  'ሙሉ የውይይት ባህሪያትን ለመጠቀም እባክዎ ይግቡ።',
                  'Please sign in to use full chat features.',
                  'Amaloota marii guutuu fayyadamuuf maaloo seensaa.',
                  language
                )}
              </div>
            )}
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={getLocalizedText(
                  'መልዕክት ይተይቡ...',
                  'Type a message...',
                  'Ergaa barreessi...',
                  language
                )}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500 text-center">
              {newMessage.length}/500 {getLocalizedText('ቁምፊዎች',  'characters',  language)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
