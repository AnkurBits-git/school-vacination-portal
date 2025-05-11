import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentFormPage from './pages/StudentFormPage';
import DrivesPage from './pages/DrivesPage';
import DriveFormPage from './pages/DriveFormPage';
import ReportsPage from './pages/ReportsPage';
import Layout from './components/Layout';

// Enhanced modern theme for clean, sleek UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007bff', // Elegant blue
    },
    secondary: {
      main: '#e91e63', // Vivid pink
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', sans-serif`,
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/new" element={<StudentFormPage />} />
          <Route path="students/:id/edit" element={<StudentFormPage />} />
          <Route path="drives" element={<DrivesPage />} />
          <Route path="drives/new" element={<DriveFormPage />} />
          <Route path="drives/:id/edit" element={<DriveFormPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="colored" />
    </ThemeProvider>
  );
}

export default App;
