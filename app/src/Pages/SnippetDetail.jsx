// src/Pages/SnippetDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  IconButton,
  Button,
  TextField, // Added for editing
  Stack        // Added for layout
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  ContentCopy as CopyIcon,
  Edit as EditIcon,       // Added for Edit button
  Save as SaveIcon        // Added for Save button
} from '@mui/icons-material';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const API_URL = "http://localhost:3000/api/snippets";

const SnippetDetail = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // ✅ NEW: State for managing edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedSnippet] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSnippetById = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch snippet. Status: ${res.status}`);
        }
        const data = await res.json();
        setSnippet(data);
        setEditedSnippet(data); // ✅ Initialize edited state
      } catch (err) {
        setError(err.message);
        console.error('Error fetching snippet:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippetById();
  }, [id]);

  // Apply syntax highlighting
  useEffect(() => {
    if (snippet && !isEditing) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [snippet, isEditing]);

  const copyCode = () => {
    if (snippet?.code) {
      navigator.clipboard.writeText(snippet.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  // ✅ NEW: Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSnippet(prev => ({ ...prev, [name]: value }));
  };

  // ✅ NEW: Handle saving the edited snippet
  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedSnippet),
        });
        if (!response.ok) {
            throw new Error(`Failed to update snippet. Status: ${response.status}`);
        }
        const updatedSnippet = await response.json();
        setSnippet(updatedSnippet); // Update the main display
        setIsEditing(false); // Exit edit mode
    } catch (err) {
        setError(err.message);
        console.error('Error updating snippet:', err);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
      setEditedSnippet(snippet); // Revert changes
      setIsEditing(false);
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Use a separate alert for save errors so fetch errors aren't overwritten
  if (!snippet && error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  if (!snippet) {
    return <Alert severity="info">Snippet not found.</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      {/* --- Header with Buttons --- */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>
          Back to List
        </Button>
        
        {isEditing ? (
            <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={isSaving}>
                    Cancel
                </Button>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </Stack>
        ) : (
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
                Edit
            </Button>
        )}
      </Stack>

      {/* --- Display or Edit Content --- */}
      {isEditing ? (
        // ✅ EDITING VIEW
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={editedSnippet.title}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={editedSnippet.description}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            multiline
            rows={15}
            label="Code"
            name="code"
            value={editedSnippet.code}
            onChange={handleInputChange}
            sx={{ '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
          />
        </Stack>
      ) : (
        // ✅ DISPLAY VIEW
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            {snippet.title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {snippet.description}
          </Typography>

          <Box sx={{ position: 'relative' }}>
            <IconButton
              size="small"
              onClick={copyCode}
              title="Copy code"
              sx={{
                position: 'absolute', top: 8, right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                zIndex: 10
              }}
            >
              <CopyIcon fontSize="small" />
            </IconButton>
            {copySuccess && (
                <Typography sx={{ position: 'absolute', top: 12, right: 50, color: '#4cc9f0', fontSize: '0.8rem' }}>
                    Copied!
                </Typography>
            )}
            <pre style={{ margin: 0, borderRadius: 8, overflow: 'auto' }}>
              <code className="language-javascript">{snippet.code}</code>
            </pre>
          </Box>
        </>
      )}

      {/* Display save errors here */}
      {error && !loading && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
    </Paper>
  );
};

export default SnippetDetail;