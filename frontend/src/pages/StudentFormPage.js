import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  CircularProgress,
  Grid,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudentById, updateStudent } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const StudentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    grade: '',
    section: '',
    dateOfBirth: format(new Date(), 'yyyy-MM-dd'),
    gender: 'Male'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        try {
          setLoading(true);
          const response = await getStudentById(id);
          const student = response.data;
          setFormData({
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            grade: student.grade,
            section: student.section,
            dateOfBirth: format(new Date(student.dateOfBirth), 'yyyy-MM-dd'),
            gender: student.gender
          });
        } catch (error) {
          console.error('Error fetching student:', error);
          setError('Failed to fetch student data');
          navigate('/students');
        } finally {
          setLoading(false);
        }
      };

      fetchStudent();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      if (id) {
        await updateStudent(id, formData);
        toast.success('Student updated successfully');
      } else {
        await createStudent(formData);
        toast.success('Student created successfully');
      }
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      setError(error.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        {id ? 'Edit Student' : 'Add New Student'}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Grade</InputLabel>
              <Select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                label="Grade"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                  <MenuItem key={grade} value={`Grade ${grade}`}>Grade {grade}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            fullWidth
            sx={{ maxWidth: 250 }}
          >
            {id ? 'Update Student' : 'Add Student'}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/students')}
            fullWidth
            sx={{ maxWidth: 250 }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default StudentFormPage;
