import { createSlice } from '@reduxjs/toolkit';
import { mockProjects, mockUsers } from '../../data/mockData';

const initialState = {
  projects: mockProjects,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push({
        ...action.payload,
        id: Date.now(),
        progress: 0,
        status: 'planning',
        createdAt: new Date().toISOString(),
      });
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
    },
    updateProjectProgress: (state, action) => {
      const { projectId, progress } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.progress = progress;
        project.status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'planning';
      }
    },
    assignProjectToLead: (state, action) => {
      const { projectId, teamLeadId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.teamLeadId = teamLeadId;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProjects,
  addProject,
  updateProject,
  updateProjectProgress,
  assignProjectToLead,
  setError,
  clearError,
} = projectSlice.actions;

export default projectSlice.reducer;