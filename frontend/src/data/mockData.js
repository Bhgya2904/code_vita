export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    username: 'teamlead1',
    password: 'lead123',
    role: 'team_lead',
    name: 'Mike Chen',
    email: 'mike@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    username: 'teamlead2',
    password: 'lead123',
    role: 'team_lead',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 4,
    username: 'member1',
    password: 'member123',
    role: 'team_member',
    name: 'Alex Thompson',
    email: 'alex@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 5,
    username: 'member2',
    password: 'member123',
    role: 'team_member',
    name: 'Jessica Park',
    email: 'jessica@company.com',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 6,
    username: 'member3',
    password: 'member123',
    role: 'team_member',
    name: 'David Kim',
    email: 'david@company.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
];

export const mockProjects = [
  {
    id: 1,
    name: 'Mobile App Redesign',
    description: 'Complete redesign of the company mobile application with modern UI/UX principles',
    deadline: '2025-09-15',
    progress: 65,
    status: 'in_progress',
    teamLeadId: 2,
    createdAt: '2025-07-01',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Customer Portal Enhancement',
    description: 'Add new features to customer portal including analytics dashboard and reporting tools',
    deadline: '2025-08-30',
    progress: 30,
    status: 'in_progress',
    teamLeadId: 3,
    createdAt: '2025-07-05',
    priority: 'medium'
  },
  {
    id: 3,
    name: 'API Security Audit',
    description: 'Comprehensive security review and implementation of best practices for all API endpoints',
    deadline: '2025-08-10',
    progress: 85,
    status: 'in_progress',
    teamLeadId: 2,
    createdAt: '2025-06-20',
    priority: 'high'
  },
  {
    id: 4,
    name: 'Database Optimization',
    description: 'Improve database performance and implement caching strategies',
    deadline: '2025-09-01',
    progress: 15,
    status: 'planning',
    teamLeadId: 3,
    createdAt: '2025-07-10',
    priority: 'medium'
  }
];

export const mockTasks = [
  {
    id: 1,
    title: 'Design Login Screen',
    description: 'Create modern login interface with improved UX',
    projectId: 1,
    assignedTo: 4,
    assignedBy: 2,
    status: 'done',
    priority: 'high',
    deadline: '2025-07-20',
    progress: 100,
    createdAt: '2025-07-05',
    completedAt: '2025-07-18'
  },
  {
    id: 2,
    title: 'Implement Dashboard Components',
    description: 'Build reusable dashboard components with responsive design',
    projectId: 1,
    assignedTo: 5,
    assignedBy: 2,
    status: 'in_progress',
    priority: 'high',
    deadline: '2025-07-28',
    progress: 70,
    createdAt: '2025-07-10'
  },
  {
    id: 3,
    title: 'API Integration Testing',
    description: 'Test all API endpoints and handle error scenarios',
    projectId: 1,
    assignedTo: 4,
    assignedBy: 2,
    status: 'todo',
    priority: 'medium',
    deadline: '2025-08-05',
    progress: 0,
    createdAt: '2025-07-15'
  },
  {
    id: 4,
    title: 'User Analytics Dashboard',
    description: 'Create analytics dashboard for customer behavior tracking',
    projectId: 2,
    assignedTo: 6,
    assignedBy: 3,
    status: 'in_progress',
    priority: 'medium',
    deadline: '2025-08-15',
    progress: 40,
    createdAt: '2025-07-08'
  },
  {
    id: 5,
    title: 'Security Vulnerability Assessment',
    description: 'Conduct thorough security testing on all endpoints',
    projectId: 3,
    assignedTo: 4,
    assignedBy: 2,
    status: 'done',
    priority: 'high',
    deadline: '2025-07-25',
    progress: 100,
    createdAt: '2025-07-01',
    completedAt: '2025-07-23'
  },
  {
    id: 6,
    title: 'Implement JWT Authentication',
    description: 'Add secure JWT-based authentication system',
    projectId: 3,
    assignedTo: 5,
    assignedBy: 2,
    status: 'in_progress',
    priority: 'high',
    deadline: '2025-08-01',
    progress: 80,
    createdAt: '2025-07-12'
  }
];

export const mockMessages = [
  {
    id: 1,
    fromUserId: 2,
    toUserId: 4,
    message: 'How is the progress on the login screen design?',
    timestamp: '2025-07-20T10:30:00Z',
    read: true
  },
  {
    id: 2,
    fromUserId: 4,
    toUserId: 2,
    message: 'Just completed it! The new design looks much cleaner.',
    timestamp: '2025-07-20T10:45:00Z',
    read: true
  },
  {
    id: 3,
    fromUserId: 3,
    toUserId: 6,
    message: 'Need your input on the analytics dashboard requirements.',
    timestamp: '2025-07-20T14:20:00Z',
    read: false
  },
  {
    id: 4,
    fromUserId: 1,
    toUserId: 2,
    message: 'Great progress on the mobile app project! Keep it up.',
    timestamp: '2025-07-20T16:00:00Z',
    read: true
  }
];

export const mockNotifications = [
  {
    id: 1,
    userId: 1,
    type: 'project_update',
    message: 'Mobile App Redesign project is 65% complete',
    timestamp: '2025-07-20T09:00:00Z',
    read: false
  },
  {
    id: 2,
    userId: 2,
    type: 'task_completed',
    message: 'Alex Thompson completed "Design Login Screen"',
    timestamp: '2025-07-18T15:30:00Z',
    read: true
  },
  {
    id: 3,
    userId: 3,
    type: 'deadline_reminder',
    message: 'Customer Portal Enhancement deadline is approaching',
    timestamp: '2025-07-20T08:00:00Z',
    read: false
  }
];