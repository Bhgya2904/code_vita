import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  Target,
  Award,
  FileText
} from 'lucide-react';
import { mockUsers, mockProjects } from '../../data/mockData';
import { formatDate } from '../../lib/utils';

const TeamMemberReports = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);

  // Filter data for current user
  const myTasks = tasks.filter(task => task.assignedTo === user.id);
  const myProjectIds = [...new Set(myTasks.map(task => task.projectId))];
  const myProjects = projects.filter(project => myProjectIds.includes(project.id));

  // Calculate statistics
  const stats = {
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(t => t.status === 'done').length,
    inProgressTasks: myTasks.filter(t => t.status === 'in_progress').length,
    todoTasks: myTasks.filter(t => t.status === 'todo').length,
    totalProjects: myProjects.length,
    avgProgress: myTasks.length > 0 ? Math.round(myTasks.reduce((acc, task) => acc + task.progress, 0) / myTasks.length) : 0,
    completionRate: myTasks.length > 0 ? Math.round((myTasks.filter(t => t.status === 'done').length / myTasks.length) * 100) : 0
  };

  // Task completion by priority
  const tasksByPriority = [
    { 
      priority: 'High', 
      total: myTasks.filter(t => t.priority === 'high').length,
      completed: myTasks.filter(t => t.priority === 'high' && t.status === 'done').length,
      color: '#ef4444'
    },
    { 
      priority: 'Medium', 
      total: myTasks.filter(t => t.priority === 'medium').length,
      completed: myTasks.filter(t => t.priority === 'medium' && t.status === 'done').length,
      color: '#f59e0b'
    },
    { 
      priority: 'Low', 
      total: myTasks.filter(t => t.priority === 'low').length,
      completed: myTasks.filter(t => t.priority === 'low' && t.status === 'done').length,
      color: '#10b981'
    }
  ];

  // Task status distribution
  const statusData = [
    { name: 'To Do', value: stats.todoTasks, color: '#6b7280' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' }
  ];

  // Weekly productivity (mock data)
  const weeklyData = [
    { week: 'Week 1', tasksCompleted: 3, hoursWorked: 32 },
    { week: 'Week 2', tasksCompleted: 5, hoursWorked: 38 },
    { week: 'Week 3', tasksCompleted: 2, hoursWorked: 28 },
    { week: 'Week 4', tasksCompleted: 4, hoursWorked: 35 }
  ];

  // Project contribution
  const projectContribution = myProjects.map(project => {
    const projectTasks = myTasks.filter(task => task.projectId === project.id);
    const completedProjectTasks = projectTasks.filter(task => task.status === 'done').length;
    
    return {
      name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
      myTasks: projectTasks.length,
      completed: completedProjectTasks,
      contribution: projectTasks.length > 0 ? Math.round((completedProjectTasks / projectTasks.length) * 100) : 0
    };
  });

  // Performance rating
  const getPerformanceRating = () => {
    if (stats.completionRate >= 90) return { rating: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (stats.completionRate >= 75) return { rating: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (stats.completionRate >= 60) return { rating: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { rating: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const performance = getPerformanceRating();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Performance Report</h1>
          <p className="text-gray-600">Track your productivity and task completion metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            This Month
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <Card className={`border-2 ${performance.rating === 'Excellent' ? 'border-green-200 bg-green-50' : performance.rating === 'Good' ? 'border-blue-200 bg-blue-50' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Overall Performance</span>
              </CardTitle>
              <CardDescription>Your current performance rating based on task completion</CardDescription>
            </div>
            <Badge className={`${performance.bgColor} ${performance.color} text-lg px-4 py-2`}>
              {performance.rating}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.completedTasks}</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalProjects}</div>
              <div className="text-sm text-gray-600">Projects Involved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</div>
              <div className="text-sm text-gray-600">Avg Task Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Across {stats.totalProjects} projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              Currently working on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todoTasks}</div>
            <p className="text-xs text-muted-foreground">
              Ready to start
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Productivity</CardTitle>
            <CardDescription>Tasks completed over the last 4 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tasksCompleted" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Current breakdown of your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
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
        {/* Task Priority Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Priority</CardTitle>
            <CardDescription>Task completion rate by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tasksByPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="total" fill="#e5e7eb" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Contribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Contributions</CardTitle>
            <CardDescription>Your task completion by project</CardDescription>
          </CardHeader>
          <CardContent>
            {projectContribution.length > 0 ? (
              <div className="space-y-4">
                {projectContribution.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{project.name}</span>
                      <span className="text-sm text-gray-600">{project.completed}/{project.myTasks} tasks</span>
                    </div>
                    <Progress value={project.contribution} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No project data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
          <CardDescription>Your latest task completions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myTasks
              .filter(task => task.status === 'done')
              .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
              .slice(0, 5)
              .map((task) => {
                const project = myProjects.find(p => p.id === task.projectId);
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600">{project?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 mb-1">Completed</Badge>
                      <div className="text-xs text-gray-500">
                        {formatDate(task.completedAt || task.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            
            {myTasks.filter(task => task.status === 'done').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No completed tasks to show yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMemberReports;