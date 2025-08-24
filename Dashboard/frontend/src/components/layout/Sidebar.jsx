import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  BarChart3,
  CheckSquare,
  UserPlus,
  FileText,
  X,
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
          { name: 'All Projects', href: '/admin/projects', icon: FolderKanban },
          { name: 'Team Leads', href: '/admin/team-leads', icon: Users },
          { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
          { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
        ];
      case 'team_lead':
        return [
          { name: 'Dashboard', href: '/team-lead', icon: LayoutDashboard },
          { name: 'My Projects', href: '/team-lead/projects', icon: FolderKanban },
          { name: 'Assign Tasks', href: '/team-lead/assign-tasks', icon: UserPlus },
          { name: 'Team Members', href: '/team-lead/team', icon: Users },
          { name: 'Communication', href: '/team-lead/chat', icon: MessageSquare },
        ];
      case 'team_member':
        return [
          { name: 'Dashboard', href: '/team-member', icon: LayoutDashboard },
          { name: 'My Tasks', href: '/team-member/tasks', icon: CheckSquare },
          { name: 'Projects', href: '/team-member/projects', icon: FolderKanban },
          { name: 'Communication', href: '/team-member/chat', icon: MessageSquare },
          { name: 'Reports', href: '/team-member/reports', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "fixed inset-0 z-20 bg-black/60 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <div className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-full w-64 flex-col bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-gray-200",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-[73px] items-center justify-between border-b border-gray-200 px-4 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Project Hub</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 -mr-2">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 shrink-0">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Need Help?</h4>
            <p className="text-xs text-gray-600 mb-3">
              Check our documentation for guides and tutorials.
            </p>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              View Documentation →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;