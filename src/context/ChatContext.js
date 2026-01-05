import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage, getLocalizedText } from './LanguageContext';

// Create the chat context
const ChatContext = createContext();

// Hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Chat provider component
export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState('general');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Chat rooms configuration
  const chatRooms = [
    {
      id: 'general',
      name: { 
        amharic: 'አጠቃላይ ውይይት', 
        english: 'General Discussion', 
        oromo: 'Marii Waliigala' 
      },
      description: { 
        amharic: 'አጠቃላይ ውይይቶች', 
        english: 'General conversations', 
        oromo: 'Mariilee waliigalaa' 
      },
      memberCount: 156,
      icon: '💬',
      color: 'blue'
    },
    {
      id: 'support',
      name: { 
        amharic: 'ድጋፍ እና እርዳታ', 
        english: 'Support & Help', 
        oromo: 'Deeggarsa fi Gargaarsa' 
      },
      description: { 
        amharic: 'ቴክኒካል ድጋፍ', 
        english: 'Technical support and assistance', 
        oromo: 'Deeggarsa teeknooloojii' 
      },
      memberCount: 45,
      icon: '🆘',
      color: 'red'
    },
    {
      id: 'services',
      name: { 
        amharic: 'የመንግስት አገልግሎቶች', 
        english: 'Government Services', 
        oromo: 'Tajaajilaalee Mootummaa' 
      },
      description: { 
        amharic: 'አገልግሎት ውይይቶች', 
        english: 'Service discussions', 
        oromo: 'Mariilee tajaajilaa' 
      },
      memberCount: 89,
      icon: '🏛️',
      color: 'green'
    },
    {
      id: 'announcements',
      name: { 
        amharic: 'ማስታወቂያዎች', 
        english: 'Announcements', 
        oromo: 'Beeksisaawwan' 
      },
      description: { 
        amharic: 'ወቅታዊ ማስታወቂያዎች', 
        english: 'Official announcements', 
        oromo: 'Beeksisaawwan offfishalii' 
      },
      memberCount: 234,
      icon: '📢',
      color: 'yellow'
    },
    {
      id: 'feedback',
      name: { 
        amharic: 'አስተያየት እና ሐሳብ', 
        english: 'Feedback & Ideas', 
        oromo: 'Yaadaafi Yaada' 
      },
      description: { 
        amharic: 'የመሻሻል ሐሳቦች', 
        english: 'Suggestions for improvement', 
        oromo: 'Yaadasuumsaa fooyya\'inaa' 
      },
      memberCount: 67,
      icon: '💡',
      color: 'purple'
    }
  ];

  // Initialize with mock messages
  useEffect(() => {
    const initializeMessages = () => {
      const mockMessages = [
        {
          id: 1,
          user: 'System',
          userAm: 'ስርዓት',
          userOr: 'Sirna',
          message: getLocalizedText(
            '🎉 እንኳን ወደ የመንግስት አገልግሎት ማዕከል ውይይት በደህና መጡ! እዚህ ጥያቄዎችን መጠየቅ፣ ሐሳቦችን ማካፈል እና ከሌሎች ዜጎች ጋር መወያየት ይችላሉ።',
            '🎉 Welcome to the Government Service Center Chat! Here you can ask questions, share ideas, and discuss with other citizens.',
            '🎉 Baga gara Marii Qabaneessa Tajaajila Mootummaatti nagaan dhuftan! Asitti gaaffii gaafachuu, yaada qooddachuu fi lammiilee biroo waliin mariisuudhaan ni dandeessu.',
            language
          ),
          timestamp: new Date(Date.now() - 600000).toISOString(),
          room: 'general',
          type: 'system'
        },
        {
          id: 2,
          user: 'Support Team',
          userAm: 'የድጋፍ ቡድን',
          userOr: 'Garee Deeggarsa',
          message: getLocalizedText(
            '👋 ሰላም! የቴክኒካል ድጋፍ፣ የአገልግሎት መመሪያ ወይም ማንኛውም ጥያቄ ካለዎት እዚህ ይጠይቁ። በ24/7 ማገልገል ዝግጁዎች ነን።',
            '👋 Hello! If you have technical support needs, service guidance, or any questions, ask here. We are ready to serve 24/7.',
            '👋 Akkam! Yoo deeggarsi teeknooloojii, qajeelfama tajaajilaa ykn gaaffiin kamiyyuu qabaattan asitti gaafadhaa. Sa\'a 24/7 tajaajiluf qophaa\'oo dha.',
            language
          ),
          timestamp: new Date(Date.now() - 300000).toISOString(),
          room: 'support',
          type: 'support'
        },
        {
          id: 3,
          user: 'Admin',
          userAm: 'አስተዳዳሪ',
          userOr: 'Bulchaa',
          message: getLocalizedText(
            '📋 የአገልግሎት ጥያቄዎች፣ የሰነድ መመሪያዎች፣ እና የመንግስት አገልግሎቶች ውይይት እዚህ ይካሄዳል። እባክዎን የህብረተሰብ መመሪያዎችን በመከተል ጠቃሚ ውይይት እናድርግ።',
            '📋 Service requests, document guidance, and government services discussions happen here. Please follow community guidelines and let\'s have productive discussions.',
            '📋 Gaaffiiwwan tajaajilaa, qajeelfamoota galmee, fi mariiwwan tajaajila mootummaa asitti gaggeeffamu. Maaloo seera hawaasaa hordofudhaan marii bu\'aa qabeessa haa godhannu.',
            language
          ),
          timestamp: new Date(Date.now() - 180000).toISOString(),
          room: 'services',
          type: 'admin'
        }
      ];
      setMessages(mockMessages);
    };

    initializeMessages();
  }, [language]);

  // Mock online users
  useEffect(() => {
    const mockOnlineUsers = [
      { 
        id: 1, 
        name: 'Admin', 
        nameAm: 'አስተዳዳሪ', 
        nameOr: 'Bulchaa', 
        status: 'online', 
        role: 'admin' 
      },
      { 
        id: 2, 
        name: 'Support Team', 
        nameAm: 'የድጋፍ ቡድን', 
        nameOr: 'Garee Deeggarsa', 
        status: 'online', 
        role: 'support' 
      },
      { 
        id: 3, 
        name: 'AI Assistant', 
        nameAm: 'AI ረዳት', 
        nameOr: 'Gargaaraa AI', 
        status: 'online', 
        role: 'bot' 
      },
      { 
        id: 4, 
        name: 'Community Manager', 
        nameAm: 'የማህበረሰብ አስተዳዳሪ', 
        nameOr: 'Bulchaa Hawaasaa', 
        status: 'online', 
        role: 'moderator' 
      }
    ];
    setOnlineUsers(mockOnlineUsers);
  }, []);

  // Add a new message
  const addMessage = (messageData) => {
    const message = {
      id: Date.now(),
      user: isAuthenticated ? (user?.firstName || user?.username || 'Guest') : 'Guest',
      timestamp: new Date().toISOString(),
      room: activeRoom,
      type: 'user',
      ...messageData
    };

    setMessages(prev => [...prev, message]);

    // Auto-respond for support room
    if (activeRoom === 'support') {
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + Math.random(),
          user: 'AI Assistant',
          userAm: 'AI ረዳት',
          userOr: 'Gargaaraa AI',
          message: getLocalizedText(
            '🤖 ጥያቄዎን ተቀብለናል። የድጋፍ ቡድናችን ቶሎ ምላሽ ይሰጣል። እባክዎን ጥቂት ትዕግስት ይይዙ።',
            '🤖 We have received your question. Our support team will respond shortly. Please be patient.',
            '🤖 Gaaffii kee fudhanneerra. Gareen deeggarsa keenyaa yeroo gabaabaa keessatti deebii ni kenna. Maaloo obsaa.',
            language
          ),
          timestamp: new Date().toISOString(),
          room: activeRoom,
          type: 'bot'
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1500);
    }

    return message;
  };

  // Get messages for the current room
  const getRoomMessages = (roomId = activeRoom) => {
    return messages.filter(msg => msg.room === roomId);
  };

  // Get room by id
  const getRoom = (roomId) => {
    return chatRooms.find(room => room.id === roomId);
  };

  // Set typing indicator
  const setTypingIndicator = (typing) => {
    setIsTyping(typing);
  };

  // Calculate unread messages
  useEffect(() => {
    const unreadMessages = messages.filter(msg => 
      msg.room !== activeRoom && 
      new Date(msg.timestamp) > new Date(Date.now() - 3600000) // Last hour
    );
    setUnreadCount(unreadMessages.length);
  }, [messages, activeRoom]);

  const value = {
    // State
    messages,
    activeRoom,
    setActiveRoom,
    unreadCount,
    isTyping,
    onlineUsers,
    chatRooms,

    // Functions
    addMessage,
    getRoomMessages,
    getRoom,
    setTypingIndicator,

    // Helpers
    formatTime: (timestamp) => new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    formatDate: (timestamp) => new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    }),
    getUserDisplayName: (msg) => {
      if (language === 'am' && msg.userAm) return msg.userAm;
      return msg.user;
    },
    getMessageTypeIcon: (type) => {
      switch (type) {
        case 'system': return '🔔';
        case 'admin': return '👑';
        case 'support': return '🛠️';
        case 'bot': return '🤖';
        case 'moderator': return '🛡️';
        default: return '👤';
      }
    },
    getRoomColor: (color) => {
      const colors = {
        blue: 'bg-blue-100 text-blue-800',
        red: 'bg-red-100 text-red-800',
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        purple: 'bg-purple-100 text-purple-800'
      };
      return colors[color] || colors.blue;
    }
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
