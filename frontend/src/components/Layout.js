import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  LocalHospital as HospitalIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the AuthContext

const drawerWidth = 240;
const collapsedWidth = 60;

const Layout = () => {
  const [open, setOpen] = useState(false); // initially collapsed
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // Use AuthContext to get authentication status

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Students', icon: <GroupIcon />, path: '/students' },
    { text: 'Vaccination Drives', icon: <HospitalIcon />, path: '/drives' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
          ml: `${open ? drawerWidth : collapsedWidth}px`,
          transition: 'all 0.3s ease',
          backgroundColor: '#263238', // Dark background for the AppBar
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            School Vaccination Portal
          </Typography>
          <Avatar sx={{ width: 36, height: 36 }}>U</Avatar>
          {/* Show login/logout button based on authentication status */}
          {!isAuthenticated ? (
            <Button
              color="inherit"
              onClick={() => navigate('/login')} // Navigate to the login page
            >
              Login
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={logout} // Logout function
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar / Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedWidth,
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            backgroundColor: '#2C3E50', // Dark sidebar background
            color: 'white',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem
              button
              key={text}
              onClick={() => navigate(path)}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&:hover': {
                  backgroundColor: '#34495E', // Hover color for sidebar items
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {icon}
              </ListItemIcon>
              {open && <ListItemText primary={text} />}
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
          transition: 'width 0.3s ease',
          backgroundColor: '#ECEFF1', // Light background for the main content
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
