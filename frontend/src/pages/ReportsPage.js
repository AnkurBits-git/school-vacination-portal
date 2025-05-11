import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  CircularProgress,
  TablePagination,
  Chip,
  Alert,
  IconButton
} from '@mui/material';
import { getDrives } from '../services/api';
import { generateVaccinationReport } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import DownloadIcon from '@mui/icons-material/Download';

const ReportsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vaccineFilter, setVaccineFilter] = useState('');
  const [drives, setDrives] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await getDrives({ past: true });
        setDrives(response.data);
      } catch (error) {
        console.error('Error fetching drives:', error);
        setError('Failed to load vaccination drives.');
      }
    };

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const params = vaccineFilter ? { vaccineName: vaccineFilter } : {};
        const response = await generateVaccinationReport(params);
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to generate report');
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
    fetchReportData();
  }, [vaccineFilter]);

  const handleExport = async (format) => {
    try {
      const params = { format, vaccineName: vaccineFilter || undefined };
      const response = await generateVaccinationReport(params);
      const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vaccination_report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Vaccination Reports
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Vaccine</InputLabel>
          <Select
            value={vaccineFilter}
            onChange={(e) => setVaccineFilter(e.target.value)}
            label="Filter by Vaccine"
            fullWidth
          >
            <MenuItem value="">All Vaccines</MenuItem>
            {drives.map((drive) => (
              <MenuItem key={drive._id} value={drive.vaccineName}>
                {drive.vaccineName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleExport('csv')}
            disabled={loading}
            startIcon={<DownloadIcon />}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleExport('json')}
            disabled={loading}
            startIcon={<DownloadIcon />}
          >
            Export JSON
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : reportData.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No vaccination reports available for the selected filter.
        </Typography>
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
                  <TableCell>Status</TableCell>
                  <TableCell>Vaccine</TableCell>
                  <TableCell>Date Administered</TableCell>
                  <TableCell>Drive Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={`${row.studentId}-${row.vaccineName || 'none'}`} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>{row.studentId}</TableCell>
                      <TableCell>{row.firstName} {row.lastName}</TableCell>
                      <TableCell>{row.grade}</TableCell>
                      <TableCell>{row.section}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                          color={row.vaccinated ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{row.vaccineName || '-'}</TableCell>
                      <TableCell>
                        {row.dateAdministered ? format(new Date(row.dateAdministered), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        {row.driveDate ? format(new Date(row.driveDate), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={reportData.length}
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

export default ReportsPage;
