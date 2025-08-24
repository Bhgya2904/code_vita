import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDate, getPriorityColor, getStatusColor, getDaysUntilDeadline } from '../../lib/utils';
import { mockUsers } from '../../data/mockData';

const TaskCard = ({ task, onClick, className = "" }) => {
  const assignedUser = mockUsers.find(user => user.id === task.assignedTo);
  const daysUntilDeadline = getDaysUntilDeadline(task.deadline);
  const isOverdue = daysUntilDeadline < 0;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">
              {task.title}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description}
            </p>
          </div>
          <Badge className={`ml-2 text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <Badge className={`text-xs ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ').toUpperCase()}
          </Badge>
          
          {assignedUser && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 text-gray-400" />
              <Avatar className="h-5 w-5">
                <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {assignedUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Deadline */}
        <div className={`flex items-center space-x-1 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
          {isOverdue ? (
            <Clock className="h-3 w-3" />
          ) : (
            <Calendar className="h-3 w-3" />
          )}
          <span>
            {isOverdue ? 'Overdue' : formatDate(task.deadline)}
          </span>
          {!isOverdue && daysUntilDeadline <= 7 && (
            <Badge variant="destructive" className="text-xs">
              {daysUntilDeadline} days left
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;