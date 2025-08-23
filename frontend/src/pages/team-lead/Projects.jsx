import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from '../../components/common/ProjectCard';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Search, 
  Filter, 
  FolderKanban,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
import { mockUsers, mockTasks } from '../../data/mockData';

const TeamLeadProjects = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects assigned to current team lead
  const myProjects = projects.filter(project => project.teamLeadId === user.id);

  // Filter projects based on search and status
  const filteredProjects = myProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get project tasks
  const getProjectTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  // Calculate project statistics
  const projectStats = {
    total: myProjects.length,
    active: myProjects.filter(p => p.status === 'in_progress').length,
    completed: myProjects.filter(p => p.status === 'completed').length,
    planning: myProjects.filter(p => p.status === 'planning').length,
  };

  // Get team members for current projects
  const myTasks = tasks.filter(task => 
    myProjects.some(project => project.id === task.projectId)
  );
  const teamMemberIds = [...new Set(myTasks.map(task => task.assignedTo))];
  const teamMembers = mockUsers.filter(u => 
    u.role === 'team_member' && teamMemberIds.includes(u.id)
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const ProjectDetails = ({ project }) => {
    if (!project) return null;

    const projectTasks = getProjectTasks(project.id);
    const completedTasks = projectTasks.filter(task => task.status === 'done').length;
    const inProgressTasks = projectTasks.filter(task => task.status === 'in_progress').length;
    const todoTasks = projectTasks.filter(task => task.status === 'todo').length;

    const projectTeamMembers = [...new Set(projectTasks.map(task => task.assignedTo))]
      .map(id => mockUsers.find(user => user.id === id))
      .filter(Boolean);

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

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-900">{projectTasks.length}</p>
                </div>
                <FolderKanban className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{completedTasks}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-900">{inProgressTasks}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Team Size</p>
                  <p className="text-2xl font-bold text-purple-900">{projectTeamMembers.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Tasks Kanban */}
        <Card>
          <CardHeader>
            <CardTitle>Project Tasks</CardTitle>
            <CardDescription>Manage tasks for {project.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <KanbanBoard
              tasks={projectTasks}
              onTaskClick={(task) => console.log('View task:', task.id)}
              onAddTask={(status) => console.log('Add task to:', status)}
              projectId={project.id}
            />
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>People working on this project</CardDescription>
          </CardHeader>
          <CardContent>
            {projectTeamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTeamMembers.map((member) => {
                  const memberTasks = projectTasks.filter(task => task.assignedTo === member.id);
                  const memberCompletedTasks = memberTasks.filter(task => task.status === 'done').length;
                  const completionRate = memberTasks.length > 0 
                    ? Math.round((memberCompletedTasks / memberTasks.length) * 100)
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
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{completionRate}%</div>
                        <Badge variant={completionRate >= 80 ? 'default' : completionRate >= 60 ? 'secondary' : 'destructive'}>
                          {completionRate >= 80 ? 'Excellent' : completionRate >= 60 ? 'Good' : 'Needs Support'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No team members assigned to this project yet.
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
          <p className="text-gray-600">Manage projects assigned to your team</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50">
            {myProjects.length} Projects
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
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
          {/* Filters */}
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
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                showTeamLead={false}
                onClick={() => handleProjectClick(project)}
              />
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
                    ? 'You don\'t have any projects assigned yet. Check with your admin.'
                    : 'Try adjusting your search or filter criteria.'
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

export default TeamLeadProjects;