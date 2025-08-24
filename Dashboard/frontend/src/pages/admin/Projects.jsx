import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, assignProjectToLead } from '../../redux/slices/projectSlice';
import ProjectCard from '../../components/common/ProjectCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Plus, Search, Filter, FolderKanban, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { toast } from '../../hooks/use-toast';

const AdminProjects = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const [showAddProject, setShowAddProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '', teamLeadId: '', priority: 'medium' });

  const teamLeads = mockUsers.filter(user => user.role === 'team_lead');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const projectsByStatus = {
    planning: filteredProjects.filter(p => p.status === 'planning'),
    in_progress: filteredProjects.filter(p => p.status === 'in_progress'),
    completed: filteredProjects.filter(p => p.status === 'completed'),
  };

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description || !newProject.deadline) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    dispatch(addProject({ ...newProject, teamLeadId: newProject.teamLeadId ? parseInt(newProject.teamLeadId) : null }));
    toast({ title: "Success", description: "Project created successfully" });
    setNewProject({ name: '', description: '', deadline: '', teamLeadId: '', priority: 'medium' });
    setShowAddProject(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = { planning: 'bg-gray-100 text-gray-800', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800' };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
          <p className="text-gray-600">Manage and track all company projects</p>
        </div>
        <Button onClick={() => setShowAddProject(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Projects</CardTitle><FolderKanban className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{projects.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">In Progress</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{projectsByStatus.in_progress.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle><CheckCircle2 className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{projectsByStatus.completed.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Team Leads</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{teamLeads.length}</div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="planning">Planning</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="status">By Status</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (<ProjectCard key={project.id} project={project} onClick={() => console.log('View project:', project.id)} />))}
          </div>
        </TabsContent>
        <TabsContent value="status" className="space-y-6">
          {Object.entries(projectsByStatus).map(([status, statusProjects]) => (
            <Card key={status}>
              <CardHeader><CardTitle className="flex items-center space-x-3"><span>{status.replace('_', ' ').toUpperCase()}</span><Badge className={getStatusBadge(status)}>{statusProjects.length}</Badge></CardTitle></CardHeader>
              <CardContent>{statusProjects.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{statusProjects.map((project) => (<ProjectCard key={project.id} project={project} onClick={() => console.log('View project:', project.id)} />))}</div>) : (<div className="text-center py-8 text-gray-500">No projects in {status.replace('_', ' ')} status</div>)}</CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
        <DialogContent className="sm:max-w-[525px]"><DialogHeader><DialogTitle>Create New Project</DialogTitle><DialogDescription>Add a new project and optionally assign it to a team lead.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4"><div className="space-y-2"><Label htmlFor="name">Project Name *</Label><Input id="name" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} placeholder="Enter project name" /></div><div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} placeholder="Enter project description" rows={3} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="deadline">Deadline *</Label><Input id="deadline" type="date" value={newProject.deadline} onChange={(e) => setNewProject({...newProject, deadline: e.target.value})} /></div><div className="space-y-2"><Label htmlFor="priority">Priority</Label><Select value={newProject.priority} onValueChange={(value) => setNewProject({...newProject, priority: value})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div></div><div className="space-y-2"><Label htmlFor="teamLead">Assign Team Lead (Optional)</Label><Select value={newProject.teamLeadId} onValueChange={(value) => setNewProject({...newProject, teamLeadId: value})}><SelectTrigger><SelectValue placeholder="Select team lead" /></SelectTrigger><SelectContent>{teamLeads.map((lead) => (<SelectItem key={lead.id} value={lead.id.toString()}>{lead.name}</SelectItem>))}</SelectContent></Select></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddProject(false)}>Cancel</Button><Button onClick={handleAddProject}>Create Project</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredProjects.length === 0 && (
        <Card><CardContent className="text-center py-12"><FolderKanban className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3><p className="text-gray-600 mb-4">{searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by creating your first project.'}</p>{!searchTerm && filterStatus === 'all' && (<Button onClick={() => setShowAddProject(true)}><Plus className="h-4 w-4 mr-2" />Create First Project</Button>)}</CardContent></Card>
      )}
    </div>
  );
};

export default AdminProjects;