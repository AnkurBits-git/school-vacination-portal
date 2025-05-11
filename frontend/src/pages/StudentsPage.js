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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Add, Edit, Delete, Vaccines } from '@mui/icons-material';
import { getStudents, deleteStudent, markAsVaccinated, getDrives, bulkImportStudents } from '../services/api';
import { toast } from 'react-toastify';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', grade: '', vaccinationStatus: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loadingDrives, setLoadingDrives] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents(filters);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const handleOpenDialog = async (studentId) => {
    setSelectedStudentId(studentId);
    setOpenDialog(true);
    setLoadingDrives(true);
    try {
      const response = await getDrives({ past: true });
      setDrives(response.data);
    } catch (err) {
      toast.error('Failed to fetch drives');
    } finally {
      setLoadingDrives(false);
    }
  };

  const handleSelectDrive = async (drive) => {
    if (window.confirm('Are you sure you want to select this vaccination drive?')) {
      try {
        await markAsVaccinated(selectedStudentId, {
          driveId: drive._id,
          vaccineName: drive.vaccineName,
          date: drive.date
        });
        toast.success('Student marked as vaccinated');
        setOpenDialog(false);
        fetchStudents();
      } catch (error) {
        console.error('Error marking vaccinated:', error);
        toast.error('Failed to vaccinate student');
      }
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      await bulkImportStudents(file);
      toast.success('Students imported successfully');
      fetchStudents();
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Student Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" component="label" color="secondary">
            Import Students
            <input type="file" hidden accept=".csv, .xlsx" onChange={handleFileChange} />
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/students/new')}>
            Add Student
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField label="Search by Name" name="name" value={filters.name} onChange={handleFilterChange} size="small" fullWidth />
        <TextField label="Filter by Grade" name="grade" value={filters.grade} onChange={handleFilterChange} size="small" fullWidth />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Vaccination Status</InputLabel>
          <Select name="vaccinationStatus" value={filters.vaccinationStatus} onChange={handleFilterChange} label="Vaccination Status">
            <MenuItem value="">All Students</MenuItem>
            <MenuItem value="vaccinated">Vaccinated</MenuItem>
            <MenuItem value="not_vaccinated">Not Vaccinated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Vaccination Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.firstName} {student.lastName}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.vaccinations.length > 0 ? 'Vaccinated' : 'Not Vaccinated'}
                        color={student.vaccinations.length > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/students/${student._id}/edit`)} color="primary"><Edit /></IconButton>
                      <IconButton onClick={() => handleDelete(student._id)} color="error"><Delete /></IconButton>
                      {student.vaccinations.length === 0 && (
                        <IconButton onClick={() => handleOpenDialog(student._id)} color="secondary">
                          <Vaccines />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={students.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Vaccination Drive</DialogTitle>
        <DialogContent>
          {loadingDrives ? <CircularProgress /> : (
            <List>
              {drives.map((drive) => (
                <ListItem button key={drive._id} onClick={() => handleSelectDrive(drive)}>
                  <ListItemText
                    primary={drive.vaccineName}
                    secondary={`Date: ${new Date(drive.date).toLocaleDateString()} | Grades: ${drive.applicableGrades.join(', ')}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
