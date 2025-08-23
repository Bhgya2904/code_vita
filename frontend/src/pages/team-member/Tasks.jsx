import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskStatus } from '../../redux/slices/taskSlice';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import TaskCard from '../../components/common/TaskCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Progress } from '../../components/ui/progress';
import { Textarea } from '../../components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  PlayCircle, 
  Square,
  MessageSquare,
  Flag
} from 'lucide-react';
import { formatDate, getPriorityColor, getStatusColor } from '../../lib/utils';
import { mockUsers, mockProjects } from '../../data/mockData';

const TeamMemberTasks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');

  // Filter tasks assigned to current user
  const myTasks = tasks.filter(task => task.assignedTo === user.id);
  
  // Group tasks by status
  const tasksByStatus = {
    todo: myTasks.filter(task => task.status === 'todo'),
    in_progress: myTasks.filter(task => task.status === 'in_progress'),
    done: myTasks.filter(task => task.status === 'done'),
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    const progress = newStatus === 'done' ? 100 : newStatus === 'in_progress' ? 50 : 0;
    dispatch(updateTaskStatus({ taskId, status: newStatus, progress }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo': return <Square className="h-4 w-4" />;
      case 'in_progress': return <PlayCircle className="h-4 w-4" />;
      case 'done': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const TaskDetails = ({ task }) => {
    if (!task) return null;

    const project = mockProjects.find(p => p.id === task.projectId);
    const assignedBy = mockUsers.find(u => u.id === task.assignedBy);
    
    return (
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <span>{task.title}</span>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {task.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">{task.progress}%</span>
              </div>
              <Progress value={task.progress} />
            </div>

            {/* Task Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>Deadline:</strong> {formatDate(task.deadline)}
                  </span>
                </div>
                
                {project && (
                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Project:</strong> {project.name}
                    </span>
                  </div>
                )}
                
                {assignedBy && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Assigned by:</strong> {assignedBy.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>Created:</strong> {formatDate(task.createdAt)}
                  </span>
                </div>
                
                {task.completedAt && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      <strong>Completed:</strong> {formatDate(task.completedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Actions */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Update Status</h4>
              <div className="flex space-x-2">
                {['todo', 'in_progress', 'done'].map((status) => (
                  <Button
                    key={status}
                    variant={task.status === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate(task.id, status)}
                    className="flex items-center space-x-2"
                  >
                    {getStatusIcon(status)}
                    <span>{status.replace('_', ' ').toUpperCase()}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Add Progress Update</span>
              </h4>
              <Textarea
                placeholder="Share your progress, blockers, or questions..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-3"
              />
              <Button size="sm" onClick={() => {
                // Here you would typically save the comment
                console.log('Comment saved:', comment);
                setComment('');
              }}>
                Add Comment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">Manage and track your assigned tasks</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-gray-50">
            {myTasks.length} Total Tasks
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {tasksByStatus.done.length} Completed
          </Badge>
        </div>
      </div>

      {/* Task Views */}
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <KanbanBoard
            tasks={myTasks}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Tasks by Status */}
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <span>{status.replace('_', ' ').toUpperCase()}</span>
                  <Badge variant="secondary">{statusTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statusTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tasks in {status.replace('_', ' ')} status
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Task Details Modal */}
      <TaskDetails task={selectedTask} />

      {/* Empty State */}
      {myTasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Assigned</h3>
            <p className="text-gray-600">
              You don't have any tasks assigned yet. Check with your team lead or wait for new assignments.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamMemberTasks;