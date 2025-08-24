import { createSlice } from '@reduxjs/toolkit';
import { mockTasks } from '../../data/mockData';

const initialState = {
  tasks: mockTasks,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push({
        ...action.payload,
        id: Date.now(),
        progress: 0,
        createdAt: new Date().toISOString(),
      });
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    updateTaskStatus: (state, action) => {
      const { taskId, status, progress } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        task.progress = progress || (status === 'done' ? 100 : status === 'in_progress' ? 50 : 0);
        if (status === 'done') {
          task.completedAt = new Date().toISOString();
        }
      }
    },
    reorderTasks: (state, action) => {
      const { sourceIndex, destinationIndex, sourceStatus, destinationStatus, taskId } = action.payload;
      
      // Find the task being moved
      const taskIndex = state.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return;
      
      const task = state.tasks[taskIndex];
      
      // Update task status if moving between columns
      if (sourceStatus !== destinationStatus) {
        task.status = destinationStatus;
        task.progress = destinationStatus === 'done' ? 100 : 
                       destinationStatus === 'in_progress' ? 50 : 0;
        if (destinationStatus === 'done') {
          task.completedAt = new Date().toISOString();
        }
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
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
  setTasks,
  addTask,
  updateTask,
  updateTaskStatus,
  reorderTasks,
  deleteTask,
  setError,
  clearError,
} = taskSlice.actions;

export default taskSlice.reducer;