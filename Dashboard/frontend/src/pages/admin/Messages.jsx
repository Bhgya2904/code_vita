import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, markMessageAsRead } from '../../redux/slices/chatSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';
import { 
  MessageSquare, Send, Search, Users, Clock, CheckCheck, ArrowLeft
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { mockUsers } from '../../data/mockData';
import { cn } from '../../lib/utils';

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get all users except admin
  const allUsers = mockUsers.filter(u => u.id !== user.id);
  
  // Filter users based on search
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get conversations with each user
  const conversations = filteredUsers.map(chatUser => {
    const userMessages = messages.filter(msg => 
      (msg.fromUserId === user.id && msg.toUserId === chatUser.id) ||
      (msg.fromUserId === chatUser.id && msg.toUserId === user.id)
    );
    
    const lastMessage = userMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    const unreadCount = userMessages.filter(msg => 
      msg.fromUserId === chatUser.id && msg.toUserId === user.id && !msg.read
    ).length;

    return {
      user: chatUser,
      messages: userMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      lastMessage,
      unreadCount
    };
  });

  // Sort conversations by last message time
  const sortedConversations = conversations.sort((a, b) => {
    if (!a.lastMessage && !b.lastMessage) return 0;
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    dispatch(addMessage({
      fromUserId: user.id,
      toUserId: selectedUser.id,
      message: newMessage.trim()
    }));

    setNewMessage('');
  };

  const handleSelectUser = (chatUser) => {
    setSelectedUser(chatUser);
    
    // Mark all messages from this user as read
    const userMessages = messages.filter(msg => 
      msg.fromUserId === chatUser.id && msg.toUserId === user.id && !msg.read
    );
    
    userMessages.forEach(msg => {
      dispatch(markMessageAsRead(msg.id));
    });
  };

  const selectedConversation = conversations.find(conv => conv.user.id === selectedUser?.id);
  const totalUnreadMessages = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with team leads and members</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50">
            {totalUnreadMessages} Unread
          </Badge>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Conversations List */}
        <Card className={cn("lg:col-span-1 flex flex-col", selectedUser ? "hidden lg:flex" : "flex")}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Conversations</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-3">
                {sortedConversations.map((conversation) => (
                  <div key={conversation.user.id} onClick={() => handleSelectUser(conversation.user)} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedUser?.id === conversation.user.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                    <Avatar className="h-10 w-10"><AvatarImage src={conversation.user.avatar} alt={conversation.user.name} /><AvatarFallback className="bg-blue-100 text-blue-600">{conversation.user.name.charAt(0)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between"><h4 className="text-sm font-medium text-gray-900 truncate">{conversation.user.name}</h4>{conversation.unreadCount > 0 && (<Badge className="bg-red-500 text-white text-xs ml-2">{conversation.unreadCount}</Badge>)}</div>
                      <div className="flex items-center space-x-1"><Badge className={`text-xs ${conversation.user.role === 'team_lead' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{conversation.user.role.replace('_', ' ').toUpperCase()}</Badge></div>
                      {conversation.lastMessage && (<p className="text-xs text-gray-500 truncate mt-1">{conversation.lastMessage.message}</p>)}
                    </div>
                  </div>
                ))}
                {sortedConversations.length === 0 && (<div className="text-center py-8 text-gray-500">{searchTerm ? 'No users found' : 'No conversations yet'}</div>)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className={cn("lg:col-span-2 flex flex-col", selectedUser ? "flex" : "hidden lg:flex")}>
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className="lg:hidden -ml-2" onClick={() => setSelectedUser(null)}><ArrowLeft className="h-5 w-5" /></Button>
                  <Avatar className="h-10 w-10"><AvatarImage src={selectedUser.avatar} alt={selectedUser.name} /><AvatarFallback className="bg-blue-100 text-blue-600">{selectedUser.name.charAt(0)}</AvatarFallback></Avatar>
                  <div><CardTitle className="text-lg">{selectedUser.name}</CardTitle><CardDescription className="flex items-center space-x-2"><Badge className={`text-xs ${selectedUser.role === 'team_lead' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{selectedUser.role.replace('_', ' ').toUpperCase()}</Badge><span>•</span><span>{selectedUser.email}</span></CardDescription></div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation?.messages.map((message) => (<div key={message.id} className={`flex ${message.fromUserId === user.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.fromUserId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}><p className="text-sm">{message.message}</p><div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${message.fromUserId === user.id ? 'text-blue-100' : 'text-gray-500'}`}><Clock className="h-3 w-3" /><span>{formatDateTime(message.timestamp)}</span>{message.fromUserId === user.id && (<CheckCheck className={`h-3 w-3 ${message.read ? 'text-blue-200' : 'text-blue-300'}`} />)}</div></div></div>))}
                    {selectedConversation?.messages.length === 0 && (<div className="text-center py-8 text-gray-500">No messages yet. Start a conversation!</div>)}
                  </div>
                </ScrollArea>
                <div className="border-t p-4 mt-auto">
                  <div className="flex space-x-2"><Textarea placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} className="resize-none" rows={2} /><Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="px-6"><Send className="h-4 w-4" /></Button></div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center"><MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Conversation</h3><p className="text-gray-600">Choose a team member from the list to start messaging</p></div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminMessages;