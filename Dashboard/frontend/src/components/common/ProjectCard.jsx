import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import { formatDate, getPriorityColor, getStatusColor, getDaysUntilDeadline } from '../../lib/utils';
import { mockUsers, mockTasks } from '../../data/mockData';

const ProjectCard = ({ project, onClick, showTeamLead = true, className = "" }) => {
  const teamLead = mockUsers.find(user => user.id === project.teamLeadId);
  const projectTasks = mockTasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'done').length;
  const daysUntilDeadline = getDaysUntilDeadline(project.deadline);
  const isOverdue = daysUntilDeadline < 0;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="ml-3 flex flex-col items-end space-y-1">
            <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Tasks Summary */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>{completedTasks}/{projectTasks.length} tasks</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{projectTasks.length > 0 ? new Set(projectTasks.map(t => t.assignedTo)).size : 0} members</span>
          </div>
        </div>

        {/* Team Lead and Deadline */}
        <div className="flex items-center justify-between">
          {showTeamLead && teamLead && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Lead:</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={teamLead.avatar} alt={teamLead.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {teamLead.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-700 truncate max-w-20">
                {teamLead.name.split(' ')[0]}
              </span>
            </div>
          )}
          
          <div className={`flex items-center space-x-1 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            <Calendar className="h-3 w-3" />
            <span>
              {isOverdue ? 'Overdue' : formatDate(project.deadline)}
            </span>
          </div>
        </div>

        {/* Deadline Warning */}
        {!isOverdue && daysUntilDeadline <= 7 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-800 font-medium">
                Deadline in {daysUntilDeadline} days
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;