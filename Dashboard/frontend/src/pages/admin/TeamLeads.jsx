import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  Clock,
  Star,
  Mail,
  MessageSquare
} from 'lucide-react';
import { mockUsers, mockTasks } from '../../data/mockData';

const AdminTeamLeads = () => {
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);

  // Get team leads
  const teamLeads = mockUsers.filter(user => user.role === 'team_lead');

  // Calculate stats for each team lead
  const teamLeadStats = teamLeads.map(lead => {
    const leadProjects = projects.filter(p => p.teamLeadId === lead.id);
    const leadTasks = tasks.filter(task => 
      leadProjects.some(project => project.id === task.projectId)
    );
    const completedTasks = leadTasks.filter(task => task.status === 'done').length;
    const avgProgress = leadProjects.length > 0 
      ? Math.round(leadProjects.reduce((acc, p) => acc + p.progress, 0) / leadProjects.length)
      : 0;
    
    const teamMemberIds = [...new Set(leadTasks.map(task => task.assignedTo))];
    const teamSize = teamMemberIds.length;

    return {
      ...lead,
      projectCount: leadProjects.length,
      taskCount: leadTasks.length,
      completedTasks,
      avgProgress,
      teamSize,
      completionRate: leadTasks.length > 0 ? Math.round((completedTasks / leadTasks.length) * 100) : 0
    };
  });

  const getPerformanceRating = (completionRate, avgProgress) => {
    const score = (completionRate + avgProgress) / 2;
    if (score >= 80) return { rating: 'Excellent', color: 'text-green-600', stars: 5 };
    if (score >= 60) return { rating: 'Good', color: 'text-blue-600', stars: 4 };
    if (score >= 40) return { rating: 'Average', color: 'text-yellow-600', stars: 3 };
    return { rating: 'Needs Improvement', color: 'text-red-600', stars: 2 };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Leads</h1>
          <p className="text-gray-600">Monitor and manage team lead performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50">
            {teamLeads.length} Active Leads
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamLeads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Managed</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamLeadStats.reduce((acc, lead) => acc + lead.projectCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamLeadStats.reduce((acc, lead) => acc + lead.completedTasks, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teamLeadStats.reduce((acc, lead) => acc + lead.completionRate, 0) / teamLeadStats.length || 0)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Lead Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamLeadStats.map((lead) => {
          const performance = getPerformanceRating(lead.completionRate, lead.avgProgress);
          
          return (
            <Card key={lead.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={lead.avatar} alt={lead.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{lead.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Mail className="h-3 w-3" />
                        <span>{lead.email}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${performance.color}`}>
                      {performance.rating}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < performance.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-blue-600">{lead.projectCount}</div>
                    <div className="text-xs text-blue-700">Projects</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-green-600">{lead.teamSize}</div>
                    <div className="text-xs text-green-700">Team Members</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-purple-600">{lead.taskCount}</div>
                    <div className="text-xs text-purple-700">Total Tasks</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Task Completion</span>
                      <span className="font-medium">{lead.completionRate}%</span>
                    </div>
                    <Progress value={lead.completionRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Average Project Progress</span>
                      <span className="font-medium">{lead.avgProgress}%</span>
                    </div>
                    <Progress value={lead.avgProgress} className="h-2" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>

                {/* Recent Activity */}
                <div className="border-t pt-3">
                  <h5 className="text-xs font-medium text-gray-500 mb-2">RECENT ACTIVITY</h5>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• {lead.completedTasks} tasks completed this week</div>
                    <div>• Managing {lead.projectCount} active projects</div>
                    <div>• Leading team of {lead.teamSize} members</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {teamLeads.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Team Leads</h3>
            <p className="text-gray-600">
              No team leads have been assigned yet. Team leads will appear here once they're added to the system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTeamLeads;