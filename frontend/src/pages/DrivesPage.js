import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  TablePagination,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Event } from '@mui/icons-material';
import { getDrives, deleteDrive } from '../services/api';
import { toast } from 'react-toastify';
import { format, isAfter } from 'date-fns';

const DrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPast, setShowPast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrives();
  }, [showPast]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const response = await getDrives({ past: showPast });
      setDrives(response.data);
    } catch (error) {
      console.error('Error fetching drives:', error);
      toast.error('Failed to load vaccination drives');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vaccination drive?')) {
      try {
        await deleteDrive(id);
        toast.success('Vaccination drive deleted successfully');
        fetchDrives();
      } catch (error) {
        console.error('Error deleting drive:', error);
        toast.error('Failed to delete vaccination drive');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Vaccination Drives</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={showPast ? 'outlined' : 'contained'}
            onClick={() => setShowPast(false)}
            sx={{ borderRadius: '20px' }}
          >
            Upcoming Drives
          </Button>
          <Button
            variant={showPast ? 'contained' : 'outlined'}
            onClick={() => setShowPast(true)}
            sx={{ borderRadius: '20px' }}
          >
            Past Drives
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/drives/new')}
            sx={{ borderRadius: '20px' }}
          >
            New Drive
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f4f6f8' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vaccine Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Available Doses</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Applicable Grades</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drives
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((drive) => (
                    <TableRow key={drive._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>{drive.vaccineName}</TableCell>
                      <TableCell>{format(new Date(drive.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{drive.availableDoses}</TableCell>
                      <TableCell>
                        {drive.applicableGrades.map(grade => (
                          <Chip key={grade} label={`Grade ${grade}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isAfter(new Date(drive.date), new Date()) ? 'Upcoming' : 'Completed'}
                          color={isAfter(new Date(drive.date), new Date()) ? 'primary' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {isAfter(new Date(drive.date), new Date()) && (
                          <IconButton
                            onClick={() => navigate(`/drives/${drive._id}/edit`)}
                            color="primary"
                            sx={{ marginRight: 1 }}
                          >
                            <Edit />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => handleDelete(drive._id)}
                          color="error"
                          sx={{ marginRight: 1 }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          onClick={() => navigate(`/drives/${drive._id}/students`)}
                          color="secondary"
                        >
                          <Event />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={drives.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default DrivesPage;
