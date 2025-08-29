// src/Pages/SnippetList.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Alert, 
  TextField,
  Paper,
  IconButton,
  Chip,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const API_URL = "http://localhost:3000/api/snippets";
const SNIPPETS_PER_PAGE = 10;

/**
 * SnippetList Component
 * Manages fetching, searching, and displaying a list of snippet cards.
 * Implements infinite scrolling, code previews, and an improved deletion process.
 */
const SnippetList = ({ showToast }) => {
  const [snippets, setSnippets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for the deletion process
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const observer = useRef();
  const searchTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // Centralized function for fetching snippets from the API.
  const fetchSnippets = useCallback(async (page) => {
    setIsLoading(true);
    try {
      let url = `${API_URL}?page=${page}&limit=${SNIPPETS_PER_PAGE}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      
      setSnippets(prev => (page === 1 ? data.snippets : [...prev, ...data.snippets]));
      setCurrentPage(data.pagination.page);
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error('Error fetching snippets:', error);
      showToast('Error loading snippets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, showToast]);

  // Consolidated fetch logic for initial load and debounced search.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchSnippets(1);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(() => {
      setSnippets([]);
      setCurrentPage(1);
      fetchSnippets(1);
    }, 500);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, fetchSnippets]);
  
  // Intersection Observer for infinite scrolling.
  const lastSnippetElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchSnippets(currentPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, currentPage, fetchSnippets]);

  // ✅ NEW: Countdown timer for auto-deletion
  useEffect(() => {
    if (!deleteDialogOpen) return;

    if (countdown === 0) {
      confirmDeleteSnippet();
      return;
    }

    const timerId = setTimeout(() => {
      setCountdown(c => c - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [deleteDialogOpen, countdown]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  
  // ✅ UPDATED: Opens the confirmation dialog and resets the timer.
  const openDeleteDialog = (id) => {
    setSnippetToDelete(id);
    setCountdown(5); // Reset timer
    setDeleteDialogOpen(true);
  };

  // Closes the confirmation dialog.
  const closeDeleteDialog = () => {
    setSnippetToDelete(null);
    setDeleteDialogOpen(false);
  };

  // ✅ UPDATED: Deletes snippet with a loading state.
  const confirmDeleteSnippet = async () => {
    if (!snippetToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/${snippetToDelete}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      setSnippets(prev => prev.filter(snippet => snippet.id !== snippetToDelete));
      showToast("Snippet deleted successfully");
    } catch (error) {
      console.error('Error deleting snippet:', error);
      showToast('Error deleting snippet. Please try again.');
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };
  
  // ✅ NEW: Helper to get a preview of the code
  const getCodePreview = (codeString) => {
      if (!codeString || typeof codeString !== 'string') return "No code available.";
      const lines = codeString.split('\n').slice(0, 4).join('\n');
      return lines + (codeString.split('\n').length > 4 ? '\n...' : '');
  };

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search by title or description"
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
        sx={{ mb: 3 }}
        InputProps={{ startAdornment: (<Box component="span" sx={{ mr: 1 }}>🔍</Box>), }}
      />
      
      {snippets.map((snippet, index) => {
        const handleDeleteClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openDeleteDialog(snippet.id);
        };

        return (
          <div key={snippet.id} ref={snippets.length === index + 1 ? lastSnippetElementRef : null}>
            <Link component={RouterLink} to={`/snippets/${snippet.id}`} underline="none">
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h3" color="primary.main">
                    {snippet.title}
                  </Typography>
                  <Chip label={snippet.id} size="small" />
                </Box>
                
                <Typography color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
                  {snippet.description}
                </Typography>

                {/* ✅ NEW: Code Preview Block */}
                <Typography 
                    component="pre"
                    sx={{
                        bgcolor: 'grey.100',
                        p: 1.5,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        maxHeight: '100px',
                        overflow: 'hidden',
                        mt: 2,
                        mb: 1,
                        color: 'text.primary'
                    }}
                >
                    {getCodePreview(snippet.code)}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton color="error" size="small" onClick={handleDeleteClick} title="Delete Snippet">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Link>
          </div>
        )
      })}
      
      {isLoading && <Typography align="center" sx={{ my: 2 }}>Loading more snippets...</Typography>}

      {!isLoading && snippets.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography align="center">
            No snippets found. Add your first code snippet!
          </Typography>
        </Alert>
      )}

      {/* ✅ UPDATED: Deletion Confirmation Dialog with Timer */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this snippet? This action cannot be undone.
            The snippet will be deleted automatically in {countdown} seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isDeleting}>Cancel</Button>
          <Button onClick={confirmDeleteSnippet} color="error" autoFocus disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : `Delete (${countdown})`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SnippetList;