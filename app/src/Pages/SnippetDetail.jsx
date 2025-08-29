// src/Pages/SnippetDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Box, Typography, Paper, CircularProgress, Alert,
  IconButton, Button, TextField, Stack
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import ClientSideCache from "../../utils/ClientSideCach"; // your caching module

const API_URL = "/api/snippets";

const SnippetDetail = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedSnippet] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch snippet function with caching
  const fetchSnippetById = async (forceRefresh = false) => {
    if (!loading) setIsRefreshing(true);
    setError('');

    try {
      // Check cache first
      if (!forceRefresh) {
        const cachedSnippet = ClientSideCache.get(`snippet-${id}`);
        if (cachedSnippet) {
          setSnippet(cachedSnippet);
          setEditedSnippet(cachedSnippet);
          setLoading(false);
          setIsRefreshing(false);
          return;
        }
      }

      // Fetch from API
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch snippet. Status: ${res.status}`);
      const data = await res.json();

      // Save to state and cache
      setSnippet(data);
      setEditedSnippet(data);
      ClientSideCache.set(`snippet-${id}`, data);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching snippet:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSnippetById();
  }, [id]);

  // Syntax highlighting
  useEffect(() => {
    if (snippet && !isEditing) {
      document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    }
  }, [snippet, isEditing]);

  // Copy code
  const copyCode = () => {
    if (snippet?.code) {
      navigator.clipboard.writeText(snippet.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Edit handlers
  const handleInputChange = e => {
    const { name, value } = e.target;
    setEditedSnippet(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedSnippet),
      });
      if (!response.ok) throw new Error(`Failed to update snippet. Status: ${response.status}`);
      const updatedSnippet = await response.json();
      setSnippet(updatedSnippet);
      setEditedSnippet(updatedSnippet);
      ClientSideCache.set(`snippet-${id}`, updatedSnippet); // Update cache
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating snippet:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedSnippet(snippet);
    setIsEditing(false);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <CircularProgress />
    </Box>
  );

  if (!snippet && error) return <Alert severity="error">Error: {error}</Alert>;
  if (!snippet) return <Alert severity="info">Snippet not found.</Alert>;

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>Back to List</Button>
        <Stack direction="row" spacing={1}>
          <LoadingButton
            variant="outlined"
            onClick={() => fetchSnippetById(true)} // force refresh
            loading={isRefreshing}
          >
            Refresh
          </LoadingButton>
          {isEditing ? (
            <>
              <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
              <LoadingButton
                variant="contained"
                startIcon={<SaveIcon />}
                loading={isSaving}
                onClick={handleSave}
              >Save</LoadingButton>
            </>
          ) : (
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </Stack>
      </Stack>

      {/* Display / Edit */}
      {isEditing ? (
        <Stack spacing={3}>
          <TextField fullWidth label="Title" name="title" value={editedSnippet.title} onChange={handleInputChange} />
          <TextField fullWidth multiline rows={3} label="Description" name="description" value={editedSnippet.description} onChange={handleInputChange} />
          <TextField fullWidth multiline rows={15} label="Code" name="code" value={editedSnippet.code} onChange={handleInputChange} sx={{ '& .MuiInputBase-root': { fontFamily: 'monospace' } }} />
        </Stack>
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom>{snippet.title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{snippet.description}</Typography>
          <Box sx={{ position: 'relative' }}>
            <IconButton size="small" onClick={copyCode} title="Copy code" sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }, zIndex: 10 }}>
              <CopyIcon fontSize="small" />
            </IconButton>
            {copySuccess && <Typography sx={{ position: 'absolute', top: 12, right: 50, color: '#4cc9f0', fontSize: '0.8rem' }}>Copied!</Typography>}
            <pre style={{ margin: 0, borderRadius: 8, overflow: 'auto' }}>
              <code className="language-javascript">{snippet.code}</code>
            </pre>
          </Box>
        </>
      )}

      {error && !loading && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
    </Paper>
  );
};

export default SnippetDetail;
