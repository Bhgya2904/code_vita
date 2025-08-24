import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { mockUsers, mockTasks } from '../../data/mockData';

const AdminReports = () => {
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);

  // Calculate overall statistics
  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    totalUsers: mockUsers.length,
    teamLeads: mockUsers.filter(u => u.role === 'team_lead').length,
    teamMembers: mockUsers.filter(u => u.role === 'team_member').length,
  };

  // Team productivity data
  const teamProductivityData = mockUsers
    .filter(user => user.role === 'team_lead')
    .map(lead => {
      const leadProjects = projects.filter(p => p.teamLeadId === lead.id);
      const leadTasks = tasks.filter(task => 
        leadProjects.some(project => project.id === task.projectId)
      );
      const completedTasks = leadTasks.filter(task => task.status === 'done').length;
      
      return {
        name: lead.name.split(' ')[0],
        tasks: leadTasks.length,
        completed: completedTasks,
        completion: leadTasks.length > 0 ? Math.round((completedTasks / leadTasks.length) * 100) : 0
      };
    });

  // Project status distribution
  const projectStatusData = [
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: '#6b7280' },
    { name: 'In Progress', value: projects.filter(p => p.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#10b981' },
  ];

  // Task priority distribution
  const taskPriorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ];

  // Weekly progress simulation
  const weeklyProgressData = [
    { week: 'Week 1', tasksCompleted: 12, tasksCreated: 18 },
    { week: 'Week 2', tasksCompleted: 19, tasksCreated: 15 },
    { week: 'Week 3', tasksCompleted: 8, tasksCreated: 22 },
    { week: 'Week 4', tasksCompleted: 15, tasksCreated: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into project and team performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Success Rate</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {stats.completedProjects} of {stats.totalProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {stats.completedTasks} of {stats.totalTasks} tasks done
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.completedTasks / stats.teamMembers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks per team member
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              15% faster than last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Team Lead Productivity</CardTitle>
            <CardDescription>Task completion by team lead</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamProductivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="tasks" fill="#e5e7eb" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress Trend</CardTitle>
            <CardDescription>Tasks created vs completed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="tasksCompleted" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasksCreated" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority Breakdown</CardTitle>
            <CardDescription>Distribution of tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {taskPriorityData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Summary</CardTitle>
          <CardDescription>Detailed breakdown by team lead</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Team Lead</th>
                  <th className="text-left py-3 px-4">Projects</th>
                  <th className="text-left py-3 px-4">Tasks</th>
                  <th className="text-left py-3 px-4">Completion Rate</th>
                  <th className="text-left py-3 px-4">Performance</th>
                </tr>
              </thead>
              <tbody>
                {teamProductivityData.map((lead, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{lead.name}</td>
                    <td className="py-3 px-4">
                      {projects.filter(p => p.teamLeadId === mockUsers.find(u => u.name.startsWith(lead.name))?.id).length}
                    </td>
                    <td className="py-3 px-4">{lead.tasks}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={lead.completion} className="w-20 h-2" />
                        <span className="text-sm">{lead.completion}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={
                          lead.completion >= 80 ? 'bg-green-100 text-green-800' :
                          lead.completion >= 60 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {lead.completion >= 80 ? 'Excellent' : 
                         lead.completion >= 60 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;