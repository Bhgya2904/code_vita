import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import TaskCard from '../../components/common/TaskCard';
import ProjectCard from '../../components/common/ProjectCard';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';

const TeamMemberDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);

  // Filter tasks assigned to current user
  const myTasks = tasks.filter(task => task.assignedTo === user.id);
  const myProjectIds = [...new Set(myTasks.map(task => task.projectId))];
  const myProjects = projects.filter(project => myProjectIds.includes(project.id));

  // Calculate statistics
  const stats = {
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(t => t.status === 'done').length,
    inProgressTasks: myTasks.filter(t => t.status === 'in_progress').length,
    todoTasks: myTasks.filter(t => t.status === 'todo').length,
    overdueTasks: myTasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'done').length,
  };

  // Task completion rate
  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  // Mock weekly progress data
  const weeklyProgressData = [
    { day: 'Mon', completed: 2, target: 3 },
    { day: 'Tue', completed: 3, target: 3 },
    { day: 'Wed', completed: 1, target: 3 },
    { day: 'Thu', completed: 4, target: 3 },
    { day: 'Fri', completed: 2, target: 3 },
    { day: 'Sat', completed: 1, target: 2 },
    { day: 'Sun', completed: 0, target: 1 },
  ];

  // Get upcoming deadlines
  const upcomingTasks = myTasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's your progress overview</p>
        </div>
        <div className="flex space-x-2">
          <Badge className="bg-green-100 text-green-800">
            {completionRate}% Complete
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTasks} total tasks
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              Currently working on
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todoTasks}</div>
            <p className="text-xs text-muted-foreground">
              Ready to start
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Progress */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Overall Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{completionRate}%</div>
              <Progress value={completionRate} className="mb-4" />
              <p className="text-sm text-gray-600">
                {stats.completedTasks} of {stats.totalTasks} tasks completed
              </p>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <Badge className="bg-green-100 text-green-800">{stats.completedTasks}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">In Progress</span>
                <Badge className="bg-blue-100 text-blue-800">{stats.inProgressTasks}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">To Do</span>
                <Badge className="bg-gray-100 text-gray-800">{stats.todoTasks}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>Tasks completed vs target this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6b7280" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Current Tasks and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks that need attention soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task}
                  onClick={() => console.log('View task:', task.id)}
                />
              ))}
              {upcomingTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No upcoming deadlines. Great job staying on track!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Projects */}
        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
            <CardDescription>Projects I'm currently involved in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProjects.slice(0, 3).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  onClick={() => console.log('View project:', project.id)}
                />
              ))}
              {myProjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No projects assigned yet. Check with your team lead!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Recognition */}
      {completionRate >= 80 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Award className="h-5 w-5" />
              <span>Outstanding Performance!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              Congratulations! You have maintained an {completionRate}% task completion rate. 
              Keep up the excellent work!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamMemberDashboard;