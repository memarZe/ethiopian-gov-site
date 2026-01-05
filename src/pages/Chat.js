import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Settings, Search, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef(null);

  // Enhanced chat rooms with more details
  const chatRooms = [
    {
      id: 'general',
      name: { amharic: 'አጠቃላይ ውይይት', english: 'General Discussion', oromo: 'Marii Waliigala' },
      description: { amharic: 'አጠቃላይ ውይይቶች', english: 'General conversations', oromo: 'Mariilee waliigalaa' },
      memberCount: 156,
      icon: '💬',
      color: 'blue'
    },
    {
      id: 'support',
      name: { amharic: 'ድጋፍ እና እርዳታ', english: 'Support & Help', oromo: 'Deeggarsa fi Gargaarsa' },
      description: { amharic: 'ቴክኒካል ድጋፍ', english: 'Technical support and assistance', oromo: 'Deeggarsa teeknooloojii' },
      memberCount: 45,
      icon: '🆘',
      color: 'red'
    },
    {
      id: 'services',
      name: { amharic: 'የመንግስት አገልግሎቶች', english: 'Government Services', oromo: 'Tajaajilaalee Mootummaa' },
      description: { amharic: 'አገልግሎት ውይይቶች', english: 'Service discussions', oromo: 'Mariilee tajaajilaa' },
      memberCount: 89,
      icon: '🏛️',
      color: 'green'
    },
    {
      id: 'announcements',
      name: { amharic: 'ማስታወቂያዎች', english: 'Announcements', oromo: 'Beeksisaawwan' },
      description: { amharic: 'ወቅታዊ ማስታወቂያዎች', english: 'Official announcements', oromo: 'Beeksisaawwan offfishalii' },
      memberCount: 234,
      icon: '📢',
      color: 'yellow'
    },
    {
      id: 'feedback',
      name: { amharic: 'አስተያየት እና ሐሳብ', english: 'Feedback & Ideas', oromo: 'Yaadaafi Yaada' },
      description: { amharic: 'የመሻሻል ሐሳቦች', english: 'Suggestions for improvement', oromo: 'Yaadasuumsaa fooyya\'inaa' },
      memberCount: 67,
      icon: '💡',
      color: 'purple'
    }
  ];

  // Mock online users
  const onlineUsers = [
    { id: 1, name: 'Admin', nameAm: 'አስተዳዳሪ', nameOr: 'Bulchaa', status: 'online', role: 'admin' },
    { id: 2, name: 'Support Team', nameAm: 'የድጋፍ ቡድን', nameOr: 'Garee Deeggarsa', status: 'online', role: 'support' },
    { id: 3, name: 'John Doe', nameAm: 'ዮሐንስ ዶ', nameOr: 'Yohaannis Doo', status: 'online', role: 'user' },
    { id: 4, name: 'Jane Smith', nameAm: 'ጄን ስሚዝ', nameOr: 'Jeen Simiiz', status: 'away', role: 'user' },
    { id: 5, name: 'AI Assistant', nameAm: 'AI ረዳት', nameOr: 'Gargaaraa AI', status: 'online', role: 'bot' }
  ];

  // Initialize with enhanced mock messages
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        user: 'System',
        userAm: 'ስርዓት',
        userOr: 'Sirna',
        message: getLocalizedText(
          '🎉 እንኳን ወደ የመንግስት አገልግሎት ማዕከል ውይይት በደህና መጡ!',
          '🎉 Welcome to the Government Service Center Chat!',
          '🎉 Baga gara Marii Qabaneessa Tajaajila Mootummaatti nagaan dhuftan!',
          language
        ),
        timestamp: new Date(Date.now() - 600000).toISOString(),
        room: 'general',
        type: 'system'
      },
      {
        id: 2,
        user: 'Admin',
        userAm: 'አስተዳዳሪ',
        userOr: 'Bulchaa',
        message: getLocalizedText(
          'ሁላችሁም ተደራሽ እና አክባሪ የመሆን ደንቦችን እንድትከተሉ እንጠይቃለን። ጥያቄዎች፣ ሐሳቦች እና አስተያየቶች በሰላም እንዲቀርቡ እንጠይቃለን።',
          'Please everyone follow the community guidelines for respectful and accessible communication. Questions, ideas, and feedback are welcome.',
          'Maaloo hunduu seera hawaasa kabajamuu fi argannoo qabuu qabu hordofaa. Gaaffiiwwan, yaadotaafi yaadni sirnaan dhiheeffaman.',
          language
        ),
        timestamp: new Date(Date.now() - 450000).toISOString(),
        room: 'general',
        type: 'admin'
      },
      {
        id: 3,
        user: 'Support Team',
        userAm: 'የድጋፍ ቡድን',
        userOr: 'Garee Deeggarsa',
        message: getLocalizedText(
          '👋 ሰላም ሁላችሁም! የቴክኒካል ድጋፍ ያስፈልጋችሁ ወይም ስለ አገልግሎቶች ጥያቄዎች ካላችሁ እዚህ ይጠይቁ።',
          '👋 Hello everyone! If you need technical support or have questions about services, ask here.',
          '👋 Akkam hunduu! Yoo deeggarsi teeknooloojii isiin barbaachise ykn waaee tajaajilaatti gaaffiin qabaattan asitti gaafadhaa.',
          language
        ),
        timestamp: new Date(Date.now() - 300000).toISOString(),
        room: 'support',
        type: 'support'
      }
    ];
    setMessages(mockMessages);
  }, [language]);

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
      user: isAuthenticated ? (user?.firstName || user?.username || 'Guest') : 'Guest',
      message: newMessage,
      timestamp: new Date().toISOString(),
      room: activeRoom,
      type: 'user'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Enhanced bot responses based on room
    if (activeRoom === 'support' && !isAuthenticated) {
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          user: 'AI Assistant',
          userAm: 'AI ረዳት',
          userOr: 'Gargaaraa AI',
          message: getLocalizedText(
            '🤖 ጥያቄዎን ተቀብለናል። ተጨማሪ ድጋፍ ለማግኘት እባክዎን ይመዘገቡ ወይም ከድጋፍ ቡድናችን ጋር ቀጥተኛ ውይይት ያድርጉ።',
            '🤖 I received your question. For additional support, please register or have a direct conversation with our support team.',
            '🤖 Gaaffii kee fudheen. Deeggarsa dabalataa argachuuf maaloo galmaa\'aa ykn garee deeggarsa keenya waliin kallattiin mariisi.',
            language
          ),
          timestamp: new Date().toISOString(),
          room: activeRoom,
          type: 'bot'
        };
        setMessages(prev => [...prev, botResponse]);
      }, 2000);
    }
  };

  const getRoomMessages = () => {
    return messages.filter(msg => msg.room === activeRoom);
  };

  const getFilteredRooms = () => {
    return chatRooms.filter(room =>
      getLocalizedText(room.name.amharic,  room.name.english,  language)
        .toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserDisplayName = (msg) => {
    if (language === 'am' && msg.userAm) return msg.userAm;
    return msg.user;
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'system': return '🔔';
      case 'admin': return '👑';
      case 'support': return '🛠️';
      case 'bot': return '🤖';
      default: return '👤';
    }
  };

  const getRoomColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      red: 'bg-red-100 text-red-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800'
    };
    return colors[color] || colors.blue;
  };

  const currentRoom = chatRooms.find(room => room.id === activeRoom);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-[800px]">
            {/* Sidebar */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {getLocalizedText('የመንግስት ውይይት',  'Government Chat',  language)}
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={getLocalizedText('ክፍሎችን ፈልግ...',  'Search rooms...',  language)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Room List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {getFilteredRooms().map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setActiveRoom(room.id)}
                      className={`w-full p-3 rounded-lg text-left hover:bg-white transition-colors ${
                        activeRoom === room.id ? 'bg-white shadow-sm border border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoomColor(room.color)}`}>
                          <span className="text-lg">{room.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {getLocalizedText(room.name.amharic,  room.name.english,  language)}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {room.memberCount} {getLocalizedText('አባላት',  'members',  language)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Online Users Toggle */}
              <div className="border-t p-4">
                <button
                  onClick={() => setShowUserList(!showUserList)}
                  className="w-full flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">
                      {getLocalizedText('መስመር ላይ',  'Online',  language)}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {onlineUsers.filter(u => u.status === 'online').length}
                    </span>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>

                {showUserList && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 p-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-gray-700 truncate">
                          {language === 'am' && user.nameAm ? user.nameAm : user.name}
                        </span>
                        {user.role === 'admin' && <span className="text-xs text-blue-600">👑</span>}
                        {user.role === 'bot' && <span className="text-xs text-green-600">🤖</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentRoom ? getRoomColor(currentRoom.color) : 'bg-gray-100'
                    }`}>
                      <span className="text-lg">{currentRoom?.icon || '💬'}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {currentRoom ? getLocalizedText(
                          currentRoom.name.amharic, 
                          currentRoom.name.english, 
                          currentRoom.name.oromo, 
                          language
                        ) : 'Chat'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {currentRoom?.memberCount} {getLocalizedText('አባላት',  'members',  language)}
                        {' • '}
                        {currentRoom ? getLocalizedText(
                          currentRoom.description.amharic,
                          currentRoom.description.english,
                          currentRoom.description.oromo,
                          language
                        ) : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voice Call">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Video Call">
                      <Video className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Room Info">
                      <Info className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Settings">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getRoomMessages().map((message, index) => {
                  const prevMessage = getRoomMessages()[index - 1];
                  const showDate = !prevMessage || 
                    formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center mb-4">
                          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                            message.type === 'user' ? 'bg-blue-100 text-blue-600' :
                            message.type === 'bot' ? 'bg-green-100 text-green-600' :
                            message.type === 'admin' ? 'bg-red-100 text-red-600' :
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
                          <div className="mt-1 text-sm text-gray-700 leading-relaxed">
                            {message.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4 bg-white">
                {!isAuthenticated && (
                  <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                    {getLocalizedText(
                      '⚠️ ሙሉ የውይይት ባህሪያትን ለመጠቀም እባክዎን ይመዘገቡ። እንደ እንግዳ መልዕክት መላክ ይችላሉ፣ ነገር ግን ተጨማሪ ባህሪያት አይኖሩዎትም።',
                      '⚠️ Please register to use full chat features. You can send messages as a guest, but you won\'t have additional features.',
                      '⚠️ Amaloota marii guutuu fayyadamuuf maaloo galmaa\'aa. Akka keessummaa ergaa erguu dandeessu, garuu amaloolee dabalataa hin qabdu.',
                      language
                    )}
                  </div>
                )}
                <form onSubmit={sendMessage} className="flex space-x-3">
                  <div className="flex-1">
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
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      maxLength={1000}
                    />
                    <div className="mt-1 text-xs text-gray-500 text-right">
                      {newMessage.length}/1000
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {getLocalizedText('ላክ',  'Send',  language)}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
