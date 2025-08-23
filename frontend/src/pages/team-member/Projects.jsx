import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from '../../components/common/ProjectCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { 
  Search, 
  FolderKanban,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { formatDate } from '../../lib/utils';

const TeamMemberProjects = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter tasks assigned to current user
  const myTasks = tasks.filter(task => task.assignedTo === user.id);
  const myProjectIds = [...new Set(myTasks.map(task => task.projectId))];
  const myProjects = projects.filter(project => myProjectIds.includes(project.id));

  // Filter projects based on search
  const filteredProjects = myProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate project statistics for current user
  const projectStats = filteredProjects.map(project => {
    const projectTasks = myTasks.filter(task => task.projectId === project.id);
    const completedTasks = projectTasks.filter(task => task.status === 'done').length;
    const inProgressTasks = projectTasks.filter(task => task.status === 'in_progress').length;
    const todoTasks = projectTasks.filter(task => task.status === 'todo').length;
    
    const myCompletionRate = projectTasks.length > 0 
      ? Math.round((completedTasks / projectTasks.length) * 100)
      : 0;

    const teamLead = mockUsers.find(u => u.id === project.teamLeadId);

    return {
      ...project,
      myTasks: projectTasks.length,
      myCompleted: completedTasks,
      myInProgress: inProgressTasks,
      myTodo: todoTasks,
      myCompletionRate,
      teamLead
    };
  });

  // Overall statistics
  const overallStats = {
    totalProjects: myProjects.length,
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(task => task.status === 'done').length,
    inProgressTasks: myTasks.filter(task => task.status === 'in_progress').length,
    avgCompletionRate: projectStats.length > 0 
      ? Math.round(projectStats.reduce((acc, project) => acc + project.myCompletionRate, 0) / projectStats.length)
      : 0
  };

  const ProjectDetails = ({ project }) => {
    if (!project) return null;

    const projectTasks = myTasks.filter(task => task.projectId === project.id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <div className="flex space-x-2">
            <Badge className={`${
              project.priority === 'high' ? 'bg-red-100 text-red-800' :
              project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {project.priority} priority
            </Badge>
            <Badge className={`${
              project.status === 'completed' ? 'bg-green-100 text-green-800' :
              project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Team Lead</span>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{project.teamLead?.name || 'Not assigned'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Deadline</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{formatDate(project.deadline)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">My Contribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">My Tasks</span>
                <span className="text-sm font-medium">{project.myTasks}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">{project.myCompleted}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">My Progress</span>
                <span className="text-sm font-medium">{project.myCompletionRate}%</span>
              </div>
              <Progress value={project.myCompletionRate} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* My Tasks in this Project */}
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Tasks assigned to me in this project</CardDescription>
          </CardHeader>
          <CardContent>
            {projectTasks.length > 0 ? (
              <div className="space-y-4">
                {projectTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className={`text-xs ${
                          task.status === 'done' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">Due: {formatDate(task.deadline)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{task.progress}%</div>
                      <Progress value={task.progress} className="w-16 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tasks assigned to you in this project yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600">Projects where you have assigned tasks</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50">
            {myProjects.length} Projects
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.completedTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgCompletionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {selectedProject ? (
        /* Project Details View */
        <div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedProject(null)}
            className="mb-4"
          >
            ← Back to Projects
          </Button>
          <ProjectDetails project={selectedProject} />
        </div>
      ) : (
        /* Projects List View */
        <>
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectStats.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                onClick={() => setSelectedProject(project)}
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
                      <Badge className={`text-xs ${
                        project.priority === 'high' ? 'bg-red-100 text-red-800' :
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* My Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">My Progress</span>
                      <span className="font-medium">{project.myCompletionRate}%</span>
                    </div>
                    <Progress value={project.myCompletionRate} className="h-2" />
                  </div>

                  {/* Task Summary */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{project.myCompleted}/{project.myTasks} tasks</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(project.deadline)}</span>
                    </div>
                  </div>

                  {/* Team Lead */}
                  {project.teamLead && (
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <span className="text-xs text-gray-500">Team Lead:</span>
                      <span className="text-xs text-gray-700 font-medium">
                        {project.teamLead.name}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FolderKanban className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {myProjects.length === 0 ? 'No Projects Assigned' : 'No Projects Found'}
                </h3>
                <p className="text-gray-600">
                  {myProjects.length === 0 
                    ? 'You don\'t have any tasks assigned in projects yet. Check with your team lead.'
                    : 'Try adjusting your search criteria.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default TeamMemberProjects;