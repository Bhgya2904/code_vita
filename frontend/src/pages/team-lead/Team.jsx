import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { Input } from '../../components/ui/input';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Search,
  Mail,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';

const TeamLeadTeam = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState('');

  // Get projects assigned to current team lead
  const myProjects = projects.filter(project => project.teamLeadId === user.id);
  
  // Get tasks from my projects
  const myTasks = tasks.filter(task => 
    myProjects.some(project => project.id === task.projectId)
  );

  // Get team members
  const teamMemberIds = [...new Set(myTasks.map(task => task.assignedTo))];
  const allTeamMembers = mockUsers.filter(u => u.role === 'team_member');
  const activeTeamMembers = allTeamMembers.filter(member => teamMemberIds.includes(member.id));

  // Filter team members based on search
  const filteredMembers = activeTeamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate member statistics
  const memberStats = filteredMembers.map(member => {
    const memberTasks = myTasks.filter(task => task.assignedTo === member.id);
    const completedTasks = memberTasks.filter(task => task.status === 'done').length;
    const inProgressTasks = memberTasks.filter(task => task.status === 'in_progress').length;
    const completionRate = memberTasks.length > 0 
      ? Math.round((completedTasks / memberTasks.length) * 100)
      : 0;

    const memberProjects = [...new Set(memberTasks.map(task => task.projectId))];
    const avgTaskProgress = memberTasks.length > 0
      ? Math.round(memberTasks.reduce((acc, task) => acc + task.progress, 0) / memberTasks.length)
      : 0;

    return {
      ...member,
      taskCount: memberTasks.length,
      completedTasks,
      inProgressTasks,
      completionRate,
      avgTaskProgress,
      projectCount: memberProjects.length,
      recentActivity: memberTasks.filter(task => 
        new Date(task.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    };
  });

  // Overall team statistics
  const teamStats = {
    totalMembers: activeTeamMembers.length,
    avgCompletionRate: memberStats.length > 0 
      ? Math.round(memberStats.reduce((acc, member) => acc + member.completionRate, 0) / memberStats.length)
      : 0,
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(task => task.status === 'done').length,
    activeProjects: myProjects.filter(project => project.status === 'in_progress').length
  };

  const getPerformanceRating = (completionRate, avgProgress) => {
    const score = (completionRate + avgProgress) / 2;
    if (score >= 80) return { rating: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { rating: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { rating: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { rating: 'Needs Support', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
          <p className="text-gray-600">Monitor and support your team members</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50">
            {activeTeamMembers.length} Active Members
          </Badge>
        </div>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.avgCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Team performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {teamStats.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {memberStats.map((member) => {
          const performance = getPerformanceRating(member.completionRate, member.avgTaskProgress);
          
          return (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Mail className="h-3 w-3" />
                        <span>{member.email}</span>
                      </CardDescription>
                      <Badge className={`mt-2 text-xs ${performance.bgColor} ${performance.color}`}>
                        {performance.rating}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-blue-600">{member.taskCount}</div>
                    <div className="text-xs text-blue-700">Total Tasks</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-600">{member.completedTasks}</div>
                    <div className="text-xs text-green-700">Completed</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-600">{member.projectCount}</div>
                    <div className="text-xs text-purple-700">Projects</div>
                  </div>
                </div>

                {/* Progress Metrics */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Task Completion Rate</span>
                      <span className="font-medium">{member.completionRate}%</span>
                    </div>
                    <Progress value={member.completionRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Average Task Progress</span>
                      <span className="font-medium">{member.avgTaskProgress}%</span>
                    </div>
                    <Progress value={member.avgTaskProgress} className="h-2" />
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="text-xs font-medium text-gray-500 mb-2">CURRENT STATUS</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span className="text-gray-600">{member.inProgressTasks} in progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-gray-600">{member.recentActivity} recent tasks</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty States */}
      {activeTeamMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Team Members</h3>
            <p className="text-gray-600">
              You don't have any team members assigned yet. Team members will appear here once you assign tasks to them.
            </p>
          </CardContent>
        </Card>
      )}

      {filteredMembers.length === 0 && activeTeamMembers.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Members Found</h3>
            <p className="text-gray-600">
              No team members match your search criteria. Try adjusting your search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamLeadTeam;