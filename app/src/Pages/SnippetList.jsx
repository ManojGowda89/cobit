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
  Button,
  Stack
} from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

const API_URL = "/api/snippets";
const SNIPPETS_PER_PAGE = 10;

const SnippetList = ({ showToast }) => {
  const [snippets, setSnippets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const observer = useRef();
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Fetch snippets
  const fetchSnippets = useCallback(async (page = 1) => {
    setIsLoading(true);
    if (page === 1) setIsRefreshing(true);

    // Cancel previous request
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let url = `${API_URL}?page=${page}&limit=${SNIPPETS_PER_PAGE}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();

      setSnippets(prev => (page === 1 ? data.snippets : [...prev, ...data.snippets]));
      setCurrentPage(data.pagination.page);
      setHasMore(data.pagination.hasMore);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching snippets:', err);
        showToast('Error loading snippets. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, showToast]);

  // Initial fetch & search
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

  // Infinite scroll
  const lastSnippetElementRef = useCallback(node => {
    if (isLoading || isRefreshing) return; // disable while refreshing
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchSnippets(currentPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, isRefreshing, hasMore, currentPage, fetchSnippets]);

  // Delete countdown
  useEffect(() => {
    if (!deleteDialogOpen) return;

    if (countdown === 0) {
      confirmDeleteSnippet();
      return;
    }

    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [deleteDialogOpen, countdown]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleRefresh = () => {
    setSnippets([]);
    setCurrentPage(1);
    fetchSnippets(1);
  };

  const openDeleteDialog = (id) => {
    setSnippetToDelete(id);
    setCountdown(5);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSnippetToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDeleteSnippet = async () => {
    if (!snippetToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/${snippetToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setSnippets(prev => prev.filter(s => s.id !== snippetToDelete));
      showToast('Snippet deleted successfully');
    } catch (err) {
      console.error('Error deleting snippet:', err);
      showToast('Error deleting snippet. Please try again.');
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };

  const getCodePreview = (codeString) => {
    if (!codeString || typeof codeString !== 'string') return "No code available.";
    const lines = codeString.split('\n').slice(0, 4).join('\n');
    return lines + (codeString.split('\n').length > 4 ? '\n...' : '');
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{ startAdornment: (<Box component="span" sx={{ mr: 1 }}>🔍</Box>) }}
        />
        <LoadingButton
          variant="outlined"
          loading={isRefreshing}
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          Refresh
        </LoadingButton>
      </Stack>

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
                sx={{ p: 3, mb: 3, transition: 'all 0.3s ease', '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' } }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h3" color="primary.main">{snippet.title}</Typography>
                  <Chip label={snippet.id} size="small" />
                </Box>

                <Typography color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
                  {snippet.description}
                </Typography>

                <Typography component="pre" sx={{
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
                }}>
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
        );
      })}

      {isLoading && <Typography align="center" sx={{ my: 2 }}>Loading more snippets...</Typography>}
      {!isLoading && snippets.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography align="center">No snippets found. Add your first code snippet!</Typography>
        </Alert>
      )}

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this snippet? This action cannot be undone.
            The snippet will be deleted automatically in {countdown} seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isDeleting}>Cancel</Button>
          <Button onClick={confirmDeleteSnippet} color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : `Delete (${countdown})`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SnippetList;
