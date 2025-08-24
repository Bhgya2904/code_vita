import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { reorderTasks, updateTaskStatus } from '../../redux/slices/taskSlice';
import TaskCard from '../common/TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

const KanbanBoard = ({ tasks, onTaskClick, onAddTask, projectId = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-50 border-gray-200' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'done', title: 'Done', color: 'bg-green-50 border-green-200' },
  ];

  // Filter tasks by project if projectId is provided
  let filteredTasks = tasks;
  if (projectId) {
    filteredTasks = tasks.filter(task => task.projectId === projectId);
  }

  // Group tasks by status
  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = filteredTasks.filter(task => task.status === column.id);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    
    // Update task status if moved between columns
    if (destination.droppableId !== source.droppableId) {
      const newStatus = destination.droppableId;
      const progress = newStatus === 'done' ? 100 : newStatus === 'in_progress' ? 50 : 0;
      
      dispatch(updateTaskStatus({ 
        taskId, 
        status: newStatus, 
        progress 
      }));
    }

    // Handle reordering (you can implement this for more complex reordering)
    dispatch(reorderTasks({
      sourceIndex: source.index,
      destinationIndex: destination.index,
      sourceStatus: source.droppableId,
      destinationStatus: destination.droppableId,
      taskId,
    }));
  };

  const canAddTasks = user?.role === 'team_lead' || user?.role === 'admin';

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className={`${column.color} border-2`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                  <span>{column.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tasksByStatus[column.id].length}
                  </Badge>
                </CardTitle>
                {canAddTasks && column.id === 'todo' && onAddTask && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddTask(column.id)}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <CardContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-3 min-h-[200px] transition-colors ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                  }`}
                >
                  {tasksByStatus[column.id].map((task, index) => (
                    <Draggable 
                      key={task.id} 
                      draggableId={task.id.toString()} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-all duration-200 ${
                            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                          }`}
                        >
                          <TaskCard
                            task={task}
                            onClick={() => onTaskClick && onTaskClick(task)}
                            className={snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {tasksByStatus[column.id].length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                      {column.id === 'todo' && canAddTasks ? 'Add your first task' : 'No tasks'}
                    </div>
                  )}
                </CardContent>
              )}
            </Droppable>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;