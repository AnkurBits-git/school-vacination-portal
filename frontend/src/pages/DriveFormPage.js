import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  CircularProgress,
  Grid,
  Card,
} from '@mui/material';
import { getDriveById, createDrive, updateDrive } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const DriveFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    vaccineName: '',
    date: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Default to 15 days from now
    availableDoses: 100,
    applicableGrades: [],
    description: ''
  });

  useEffect(() => {
    setGrades(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  }, []);

  useEffect(() => {
    if (id) {
      const fetchDrive = async () => {
        try {
          setLoading(true);
          const response = await getDriveById(id);
          setFormData({
            ...response.data,
            date: format(new Date(response.data.date), 'yyyy-MM-dd')
          });
        } catch (error) {
          console.error('Error fetching drive:', error);
          toast.error('Failed to load drive data');
        } finally {
          setLoading(false);
        }
      };
      fetchDrive();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (event) => {
    const { target: { value } } = event;
    setFormData(prev => ({
      ...prev,
      applicableGrades: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await updateDrive(id, formData);
        toast.success('Vaccination drive updated successfully');
      } else {
        await createDrive(formData);
        toast.success('Vaccination drive created successfully');
      }
      navigate('/drives');
    } catch (error) {
      console.error('Error saving drive:', error);
      toast.error(error.response?.data?.message || 'Failed to save vaccination drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ boxShadow: 5, p: 3 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 600 }}>
          {id ? 'Edit Vaccination Drive' : 'Create New Vaccination Drive'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Vaccine Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vaccine Name"
                name="vaccineName"
                value={formData.vaccineName}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
            </Grid>

            {/* Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  borderRadius: 1,
                }}
              />
            </Grid>

            {/* Available Doses */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Available Doses"
                name="availableDoses"
                type="number"
                value={formData.availableDoses}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                inputProps={{ min: 1 }}
                sx={{
                  borderRadius: 1,
                }}
              />
            </Grid>

            {/* Applicable Grades */}
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Applicable Grades</InputLabel>
                <Select
                  multiple
                  name="applicableGrades"
                  value={formData.applicableGrades}
                  onChange={handleGradeChange}
                  label="Applicable Grades"
                  required
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={`Grade ${value}`} />
                      ))}
                    </Box>
                  )}
                >
                  {grades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      Grade {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                sx={{
                  borderRadius: 1,
                }}
              />
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/drives')}
              disabled={loading}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : id ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default DriveFormPage;
