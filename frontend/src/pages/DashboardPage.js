import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getDashboardStats } from '../services/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const vaccinationData = {
    labels: ['Vaccinated', 'Not Vaccinated'],
    datasets: [
      {
        data: [
          stats?.vaccinatedStudents || 0,
          (stats?.totalStudents || 0) - (stats?.vaccinatedStudents || 0)
        ],
        backgroundColor: ['#81C784', '#E57373'],
        hoverBackgroundColor: ['#66BB6A', '#EF5350'],
        borderWidth: 0,
      }
    ]
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={4}>
          <Card
            onClick={() => navigate('/students')}
            sx={{
              cursor: 'pointer',
              '&:hover': { boxShadow: 12 },
              borderRadius: 2,
              backgroundColor: '#ffffff',
              boxShadow: 4,
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <CardContent>
              <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
                Total Students
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {stats?.totalStudents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            onClick={() => navigate('/students')}
            sx={{
              cursor: 'pointer',
              '&:hover': { boxShadow: 12 },
              borderRadius: 2,
              backgroundColor: '#ffffff',
              boxShadow: 4,
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <CardContent>
              <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
                Vaccinated Students
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#e91e63' }}>
                {stats?.vaccinatedStudents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            onClick={() => navigate('/students')}
            sx={{
              cursor: 'pointer',
              '&:hover': { boxShadow: 12 },
              borderRadius: 2,
              backgroundColor: '#ffffff',
              boxShadow: 4,
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <CardContent>
              <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
                Vaccination Rate
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#388e3c' }}>
                {stats?.vaccinationPercentage || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Doughnut Graph and Upcoming Drives */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 6, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h5" color="textPrimary" sx={{ fontWeight: 600, mb: 2 }}>
                Vaccination Status
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut data={vaccinationData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 6, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h5" color="textPrimary" sx={{ fontWeight: 600, mb: 2 }}>
                Upcoming Vaccination Drives
              </Typography>
              {stats?.upcomingDrives?.length > 0 ? (
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {stats.upcomingDrives.map((drive) => (
                    <ListItem
                      button
                      onClick={() => navigate('/drives')}
                      key={drive._id}
                      sx={{
                        '&:hover': { backgroundColor: '#f1f8e9' },
                        borderRadius: 2,
                        transition: 'background-color 0.3s ease',
                        marginBottom: 1
                      }}
                    >
                      <ListItemText
                        primary={drive.vaccineName}
                        secondary={`${format(new Date(drive.date), 'MMM dd, yyyy')} - ${drive.applicableGrades.join(', ')}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
                  No upcoming vaccination drives
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
