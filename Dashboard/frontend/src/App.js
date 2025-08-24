import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useSelector } from 'react-redux';
import { Toaster } from './components/ui/toaster';

// Components
import Layout from './components/layout/Layout';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/Projects';
import AdminTeamLeads from './pages/admin/TeamLeads';
import AdminReports from './pages/admin/Reports';
import AdminMessages from './pages/admin/Messages';

// Team Lead Pages
import TeamLeadDashboard from './pages/team-lead/Dashboard';
import TeamLeadProjects from './pages/team-lead/Projects';
import TeamLeadAssignTasks from './pages/team-lead/AssignTasks';
import TeamLeadTeam from './pages/team-lead/Team';
import TeamLeadChat from './pages/team-lead/Chat';

// Team Member Pages
import TeamMemberDashboard from './pages/team-member/Dashboard';
import TeamMemberTasks from './pages/team-member/Tasks';
import TeamMemberProjects from './pages/team-member/Projects';
import TeamMemberChat from './pages/team-member/Chat';
import TeamMemberReports from './pages/team-member/Reports';

import "./App.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const getDefaultRoute = () => {
    switch (user?.role) {
      case 'admin': return '/admin';
      case 'team_lead': return '/team-lead';
      case 'team_member': return '/team-member';
      default: return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={getDefaultRoute()} replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="team-leads" element={<AdminTeamLeads />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>

      {/* Team Lead Routes */}
      <Route path="/team-lead" element={
        <ProtectedRoute allowedRoles={['team_lead']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<TeamLeadDashboard />} />
        <Route path="projects" element={<TeamLeadProjects />} />
        <Route path="assign-tasks" element={<TeamLeadAssignTasks />} />
        <Route path="team" element={<TeamLeadTeam />} />
        <Route path="chat" element={<TeamLeadChat />} />
      </Route>

      {/* Team Member Routes */}
      <Route path="/team-member" element={
        <ProtectedRoute allowedRoles={['team_member']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<TeamMemberDashboard />} />
        <Route path="tasks" element={<TeamMemberTasks />} />
        <Route path="projects" element={<TeamMemberProjects />} />
        <Route path="chat" element={<TeamMemberChat />} />
        <Route path="reports" element={<TeamMemberReports />} />
      </Route>

      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
          <Toaster />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;