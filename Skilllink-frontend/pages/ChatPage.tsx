import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import SendIcon from '../components/icons/SendIcon';

interface Message {
  id: string;
  cohortId: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'file' | 'image' | 'announcement';
  fileUrl?: string;
  fileName?: string;
  isPinned: boolean;
  createdAt: string;
}

const ChatPage: React.FC = () => {
  const { cohortId } = useParams<{ cohortId: string }>();
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup Socket.io
  useEffect(() => {
    const token = localStorage.getItem('skilllink_token');
    if (!token || !cohortId) return;

    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat');
      newSocket.emit('joinCohort', cohortId);
      fetchMessages();
    });

    newSocket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('userTyping', ({ userName, isTyping }) => {
      setTyping(prev => {
        if (isTyping) {
          return [...prev, userName];
        } else {
          return prev.filter(name => name !== userName);
        }
      });
    });

    newSocket.on('activeUsers', (users) => {
      setActiveUsers(users);
    });

    newSocket.on('messagePinned', ({ messageId, isPinned }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPinned } : msg
      ));
    });

    newSocket.on('messageDeleted', ({ messageId }) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [cohortId]);

  // Fetch message history
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('skilllink_token');
      const response = await fetch(`http://localhost:5000/api/chat/cohort/${cohortId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!socket || !newMessage.trim()) return;

    socket.emit('sendMessage', {
      cohortId,
      content: newMessage,
      type: 'text'
    });

    setNewMessage('');
  };

  // Handle typing
  const handleTyping = (isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { cohortId, isTyping });
    }
  };

  // Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;

    try {
      const formData = new FormData();
      formData.append('chatFile', file);

      const token = localStorage.getItem('skilllink_token');
      const response = await fetch('http://localhost:5000/api/upload/chat', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      socket.emit('sendMessage', {
        cohortId,
        content: `Shared a file: ${data.fileName}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize
      });
    } catch (error) {
      console.error('Failed to upload file', error);
    }
  };

  // Pin message (facilitators only)
  const pinMessage = (messageId: string) => {
    if (socket && (user?.role === 'facilitator' || user?.role === 'admin')) {
      socket.emit('pinMessage', { messageId, cohortId });
    }
  };

  // Delete message
  const deleteMessage = (messageId: string) => {
    if (socket) {
      socket.emit('deleteMessage', { messageId, cohortId });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-gray-dark border-b border-neutral-light-gray dark:border-neutral-gray-medium p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Cohort Chat</h1>
            <p className="text-sm text-neutral-gray-light">
              {activeUsers.length} active {activeUsers.length === 1 ? 'user' : 'users'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${message.sender.id === user?.id ? 'order-2' : 'order-1'}`}>
              {message.sender.id !== user?.id && (
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={message.sender.avatar || `https://ui-avatars.com/api/?name=${message.sender.name}&background=random`}
                    alt={message.sender.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs font-medium">{message.sender.name}</span>
                </div>
              )}
              
              <div
                className={`rounded-lg p-3 ${
                  message.sender.id === user?.id
                    ? 'bg-primary text-white'
                    : 'bg-neutral-light-gray dark:bg-neutral-gray-medium'
                } ${message.isPinned ? 'border-2 border-yellow-400' : ''}`}
              >
                {message.type === 'image' && message.fileUrl && (
                  <img
                    src={message.fileUrl}
                    alt="Shared image"
                    className="max-w-full rounded mb-2"
                  />
                )}
                
                {message.type === 'file' && message.fileUrl && (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm underline mb-2"
                  >
                    📎 {message.fileName}
                  </a>
                )}
                
                <p className="text-sm">{message.content}</p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                  
                  {(user?.role === 'facilitator' || user?.role === 'admin' || message.sender.id === user?.id) && (
                    <div className="flex gap-2">
                      {(user?.role === 'facilitator' || user?.role === 'admin') && (
                        <button
                          onClick={() => pinMessage(message.id)}
                          className="text-xs opacity-70 hover:opacity-100"
                        >
                          {message.isPinned ? '📌' : '📍'}
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="text-xs opacity-70 hover:opacity-100"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {typing.length > 0 && (
          <div className="text-sm text-neutral-gray-light italic">
            {typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neutral-light-gray dark:border-neutral-gray-medium p-4">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-neutral-light-gray dark:bg-neutral-gray-medium rounded-lg hover:bg-neutral-gray-light transition-colors"
          >
            📎
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            onFocus={() => handleTyping(true)}
            onBlur={() => handleTyping(false)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-neutral-light-gray dark:bg-neutral-gray-medium border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
