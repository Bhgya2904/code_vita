import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import ProjectCard from '../../components/common/ProjectCard';
import TaskCard from '../../components/common/TaskCard';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  Users, 
  Plus,
  TrendingUp 
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';

const TeamLeadDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);

  // Filter data for current team lead
  const myProjects = projects.filter(project => project.teamLeadId === user.id);
  const myTasks = tasks.filter(task => 
    myProjects.some(project => project.id === task.projectId)
  );

  // Get team members assigned to my tasks
  const teamMemberIds = [...new Set(myTasks.map(task => task.assignedTo))];
  const teamMembers = mockUsers.filter(u => 
    u.role === 'team_member' && teamMemberIds.includes(u.id)
  );

  // Calculate statistics
  const stats = {
    totalProjects: myProjects.length,
    activeProjects: myProjects.filter(p => p.status === 'in_progress').length,
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(t => t.status === 'done').length,
    pendingTasks: myTasks.filter(t => t.status === 'todo').length,
    teamMembers: teamMembers.length,
  };

  // Task completion data for chart
  const taskCompletionData = myProjects.map(project => {
    const projectTasks = myTasks.filter(task => task.projectId === project.id);
    const completedTasks = projectTasks.filter(task => task.status === 'done').length;
    
    return {
      name: project.name.substring(0, 15) + '...',
      completed: completedTasks,
      total: projectTasks.length,
      completion: projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Lead Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's your team overview</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Assign Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTasks} total tasks
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting assignment
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active contributors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Completion Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Project Task Completion</CardTitle>
          <CardDescription>Track completion progress across your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
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
                formatter={(value, name) => [
                  name === 'completed' ? `${value} completed` : `${value} total`,
                  name === 'completed' ? 'Completed Tasks' : 'Total Tasks'
                ]}
              />
              <Bar 
                dataKey="completed" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="total" 
                fill="#e5e7eb"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projects and Tasks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>Projects assigned to me</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProjects.slice(0, 3).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  showTeamLead={false}
                  onClick={() => console.log('View project:', project.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Your current team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => {
                const memberTasks = myTasks.filter(task => task.assignedTo === member.id);
                const completedTasks = memberTasks.filter(task => task.status === 'done').length;
                const completionRate = memberTasks.length > 0 
                  ? Math.round((completedTasks / memberTasks.length) * 100)
                  : 0;

                return (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{memberTasks.length} tasks assigned</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{completionRate}%</div>
                        <div className="text-xs text-gray-500">Completion</div>
                      </div>
                      <Badge variant={completionRate >= 80 ? 'default' : completionRate >= 60 ? 'secondary' : 'destructive'}>
                        {completionRate >= 80 ? 'Excellent' : completionRate >= 60 ? 'Good' : 'Needs Support'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {teamMembers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No team members assigned yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Task Activity</CardTitle>
          <CardDescription>Latest updates from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myTasks.slice(0, 6).map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onClick={() => console.log('View task:', task.id)}
              />
            ))}
          </div>
          {myTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks created yet. Start by assigning tasks to your team members.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamLeadDashboard;