import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../redux/slices/authSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Users, UserCheck, Shield } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Manage projects and oversee all operations',
      icon: Shield,
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      iconColor: 'text-red-600',
      defaultCredentials: { username: 'admin', password: 'admin123' }
    },
    {
      id: 'team_lead',
      name: 'Team Lead',
      description: 'Manage team members and assign tasks',
      icon: UserCheck,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600',
      defaultCredentials: { username: 'teamlead1', password: 'lead123' }
    },
    {
      id: 'team_member',
      name: 'Team Member',
      description: 'Complete tasks and collaborate with team',
      icon: Users,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600',
      defaultCredentials: { username: 'member1', password: 'member123' }
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Auto-fill demo credentials
    setCredentials(role.defaultCredentials);
    dispatch(clearError());
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole && credentials.username && credentials.password) {
      dispatch(login(credentials.username, credentials.password, selectedRole.id))
        .then(() => {
          // Navigate based on role
          const roleRoutes = {
            admin: '/admin',
            team_lead: '/team-lead',
            team_member: '/team-member',
          };
          navigate(roleRoutes[selectedRole.id]);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">HR</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Hub</h1>
          <p className="text-gray-600">Select your role to access the dashboard</p>
        </div>

        {!selectedRole ? (
          /* Role Selection */
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card 
                  key={role.id} 
                  className={`cursor-pointer transition-all duration-200 border-2 ${role.color} hover:shadow-lg transform hover:-translate-y-1`}
                  onClick={() => handleRoleSelect(role)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-3">
                      <IconComponent className={`h-6 w-6 ${role.iconColor}`} />
                    </div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <CardDescription className="text-sm">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      Click to Login
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-3 border">
                  <selectedRole.icon className={`h-6 w-6 ${selectedRole.iconColor}`} />
                </div>
                <CardTitle>Login as {selectedRole.name}</CardTitle>
                <CardDescription>{selectedRole.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={credentials.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                    <strong>Demo Credentials:</strong><br />
                    Username: {selectedRole.defaultCredentials.username}<br />
                    Password: {selectedRole.defaultCredentials.password}
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedRole(null);
                        setCredentials({ username: '', password: '' });
                        dispatch(clearError());
                      }}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;