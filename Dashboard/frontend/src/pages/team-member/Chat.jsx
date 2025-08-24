import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, markMessageAsRead } from '../../redux/slices/chatSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';
import { 
  MessageSquare, Send, Clock, CheckCheck, Users, AlertCircle, ArrowLeft
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { mockUsers } from '../../data/mockData';
import { cn } from '../../lib/utils';

const TeamMemberChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Get team lead, admin, and other team members
  const myTasks = tasks.filter(task => task.assignedTo === user.id);
  const myProjectIds = [...new Set(myTasks.map(task => task.projectId))];
  const myProjects = projects.filter(project => myProjectIds.includes(project.id));

  // Find Team Leads for my projects
  const teamLeadIds = [...new Set(myProjects.map(project => project.teamLeadId))];
  const teamLeads = mockUsers.filter(u => u.role === 'team_lead' && teamLeadIds.includes(u.id));

  // Find Admin
  const admin = mockUsers.find(u => u.role === 'admin');

  // Find other team members on the same projects
  const allProjectTasks = tasks.filter(task => myProjectIds.includes(task.projectId));
  const allTeamMemberIdsOnMyProjects = [...new Set(allProjectTasks.map(task => task.assignedTo))];
  const otherTeamMembers = mockUsers.filter(u => 
    u.role === 'team_member' && 
    allTeamMemberIdsOnMyProjects.includes(u.id) && 
    u.id !== user.id // Exclude self
  );

  // All users team member can chat with (using Set to ensure unique users)
  const chatUsers = [...new Set([admin, ...teamLeads, ...otherTeamMembers])].filter(Boolean);

  const conversations = chatUsers.map(chatUser => {
    const userMessages = messages.filter(msg => 
      (msg.fromUserId === user.id && msg.toUserId === chatUser.id) ||
      (msg.fromUserId === chatUser.id && msg.toUserId === user.id)
    );
    const lastMessage = userMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    const unreadCount = userMessages.filter(msg => 
      msg.fromUserId === chatUser.id && msg.toUserId === user.id && !msg.read
    ).length;
    return { user: chatUser, messages: userMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)), lastMessage, unreadCount };
  });

  const managementConversations = conversations.filter(c => c.user.role === 'admin' || c.user.role === 'team_lead');
  const teamMemberConversations = conversations.filter(c => c.user.role === 'team_member');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    dispatch(addMessage({ fromUserId: user.id, toUserId: selectedUser.id, message: newMessage.trim() }));
    setNewMessage('');
  };

  const handleSelectUser = (chatUser) => {
    setSelectedUser(chatUser);
    const userMessages = messages.filter(msg => msg.fromUserId === chatUser.id && msg.toUserId === user.id && !msg.read);
    userMessages.forEach(msg => { dispatch(markMessageAsRead(msg.id)); });
  };

  const selectedConversation = conversations.find(conv => conv.user.id === selectedUser?.id);
  const totalUnreadMessages = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  const quickMessages = [ "I need help with my current task.", "Task completed and ready for review.", "I'm blocked on this task." ];

  const renderConversationItem = (conversation) => {
    let roleBadge;
    if (conversation.user.role === 'admin') {
      roleBadge = <Badge className="text-xs bg-red-100 text-red-800">ADMIN</Badge>;
    } else if (conversation.user.role === 'team_lead') {
      roleBadge = <Badge className="text-xs bg-blue-100 text-blue-800">TEAM LEAD</Badge>;
    } else {
      roleBadge = <Badge className="text-xs bg-green-100 text-green-800">MEMBER</Badge>;
    }

    return (
      <div key={conversation.user.id} onClick={() => handleSelectUser(conversation.user)} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedUser?.id === conversation.user.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
        <Avatar className="h-10 w-10"><AvatarImage src={conversation.user.avatar} alt={conversation.user.name} /><AvatarFallback className="bg-blue-100 text-blue-600">{conversation.user.name.charAt(0)}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between"><h4 className="text-sm font-medium text-gray-900 truncate">{conversation.user.name}</h4>{conversation.unreadCount > 0 && (<Badge className="bg-red-500 text-white text-xs ml-2">{conversation.unreadCount}</Badge>)}</div>
          <div className="flex items-center space-x-1 mt-1">{roleBadge}</div>
          {conversation.lastMessage && (<p className="text-xs text-gray-500 truncate mt-1">{conversation.lastMessage.message}</p>)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Communication</h1><p className="text-gray-600">Chat with your team lead, admin, and colleagues</p></div>
        <div className="flex items-center space-x-4"><Badge variant="outline" className="bg-blue-50">{totalUnreadMessages} Unread</Badge></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        <Card className={cn("lg:col-span-1 flex flex-col", selectedUser ? "hidden lg:flex" : "flex")}>
          <CardHeader className="pb-3"><CardTitle className="flex items-center space-x-2"><Users className="h-5 w-5" /><span>Contacts</span></CardTitle></CardHeader>
          <CardContent className="p-0 flex-1"><ScrollArea className="h-full">
            <div className="p-3">
              {managementConversations.length > 0 && (<div><h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</h3><div className="space-y-1">{managementConversations.map(renderConversationItem)}</div></div>)}
              {teamMemberConversations.length > 0 && (<div className="mt-4"><h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Team Members</h3><div className="space-y-1">{teamMemberConversations.map(renderConversationItem)}</div></div>)}
              {conversations.length === 0 && (<div className="text-center py-8 text-gray-500"><AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>No contacts available</p><p className="text-xs mt-1">You need to be assigned to projects first</p></div>)}
            </div>
          </ScrollArea></CardContent>
        </Card>

        <Card className={cn("lg:col-span-2 flex flex-col", selectedUser ? "flex" : "hidden lg:flex")}>
          {selectedUser ? (
            <><CardHeader className="border-b"><div className="flex items-center space-x-3"><Button variant="ghost" size="icon" className="lg:hidden -ml-2" onClick={() => setSelectedUser(null)}><ArrowLeft className="h-5 w-5" /></Button><Avatar className="h-10 w-10"><AvatarImage src={selectedUser.avatar} alt={selectedUser.name} /><AvatarFallback className="bg-blue-100 text-blue-600">{selectedUser.name.charAt(0)}</AvatarFallback></Avatar><div><CardTitle className="text-lg">{selectedUser.name}</CardTitle><CardDescription className="flex items-center space-x-2"><Badge className={`text-xs ${selectedUser.role === 'admin' ? 'bg-red-100 text-red-800' : selectedUser.role === 'team_lead' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{selectedUser.role.replace('_', ' ').toUpperCase()}</Badge><span>•</span><span>{selectedUser.email}</span></CardDescription></div></div></CardHeader><CardContent className="p-0 flex-1 flex flex-col"><ScrollArea className="flex-1 p-4"><div className="space-y-4">{selectedConversation?.messages.map((message) => (<div key={message.id} className={`flex ${message.fromUserId === user.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.fromUserId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}><p className="text-sm">{message.message}</p><div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${message.fromUserId === user.id ? 'text-blue-100' : 'text-gray-500'}`}><Clock className="h-3 w-3" /><span>{formatDateTime(message.timestamp)}</span>{message.fromUserId === user.id && (<CheckCheck className={`h-3 w-3 ${message.read ? 'text-blue-200' : 'text-blue-300'}`} />)}</div></div></div>))}{selectedConversation?.messages.length === 0 && (<div className="text-center py-8 text-gray-500"><MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>No messages yet.</p><p className="text-sm mt-1">Start a conversation with {selectedUser.name}!</p></div>)}</div></ScrollArea><div className="border-t p-3 bg-gray-50"><p className="text-xs font-medium text-gray-600 mb-2">Quick Messages:</p><div className="flex flex-wrap gap-1">{quickMessages.map((msg, index) => (<Button key={index} variant="outline" size="sm" className="text-xs h-6" onClick={() => setNewMessage(msg)}>{msg}</Button>))}</div></div><div className="border-t p-4 mt-auto"><div className="flex space-x-2"><Textarea placeholder={`Message ${selectedUser.name}...`} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} className="resize-none" rows={2} /><Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="px-6"><Send className="h-4 w-4" /></Button></div></div></CardContent></>
          ) : (<CardContent className="flex items-center justify-center h-full"><div className="text-center"><MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Contact</h3><p className="text-gray-600">Choose someone to start messaging</p></div></CardContent>)}
        </Card>
      </div>
    </div>
  );
};

export default TeamMemberChat;