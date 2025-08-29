import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button 
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

const API_URL = "/api/snippets";

const AddCodeForm = ({ onCancel, showToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: ''
  });
  
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { title, description, code } = formData;
    
    if (!title || !description || !code) {
      showToast("All fields are required");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // 3. Get the new snippet from the response and redirect
      const newSnippet = await response.json(); 
      showToast("Snippet added successfully");
      navigate(`/snippets/${newSnippet.id}`); // Redirect to the new snippet's page

    } catch (error) {
      console.error('Error saving snippet:', error);
      showToast('Error saving snippet. Please try again.');
    }
  };

  return (
    <Paper
      elevation={3}
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Add New Snippet
      </Typography>
      
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
        margin="normal"
        placeholder="Enter a descriptive title"
      />
      
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        required
        margin="normal"
        placeholder="Brief description of what this code does"
      />
      
      <TextField
        fullWidth
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleInputChange}
        required
        margin="normal"
        multiline
        rows={8}
        placeholder="Paste your code here..."
        sx={{ 
          fontFamily: '"Fira Code", "Consolas", monospace',
          fontSize: '0.875rem'
        }}
      />
      
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save Snippet
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<CloseIcon />}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default AddCodeForm;