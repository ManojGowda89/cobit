import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Container
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AddCodeComponent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing snippets
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  
  const API_URL = "/api/snippets";

  // Load snippet data if editing
  useEffect(() => {
    if (id) {
      fetchSnippet(id);
    }
  }, [id]);

  const fetchSnippet = async (snippetId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${snippetId}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setFormData({
        title: data.title,
        description: data.description,
        code: data.code
      });
    } catch (error) {
      console.error('Error fetching snippet:', error);
      setToast({
        open: true,
        message: 'Error loading snippet data',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const saveSnippet = async (e) => {
    e.preventDefault();
    
    const { title, description, code } = formData;

    if (!title || !description || !code) {
      setToast({
        open: true,
        message: "All fields are required",
        severity: "warning"
      });
      return;
    }

    try {
      setIsLoading(true);
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_URL}/${id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, code })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      setToast({
        open: true,
        message: id ? "Snippet updated successfully" : "Snippet added successfully",
        severity: "success"
      });
      
      // Redirect after successful save
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error saving snippet:', error);
      setToast({
        open: true,
        message: 'Error saving snippet. Please try again.',
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelForm = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {id ? 'Edit Snippet' : 'Add New Snippet'}
          </Typography>
          
          <Box component="form" onSubmit={saveSnippet} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title"
              autoFocus
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of what this code does"
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Paste your code here..."
              multiline
              rows={8}
              disabled={isLoading}
              sx={{ 
                fontFamily: 'monospace',
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                }
              }}
            />
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (id ? 'Update Snippet' : 'Save Snippet')}
              </Button>
              <Button
                type="button"
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={cancelForm}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity} 
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddCodeComponent;