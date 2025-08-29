import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeListComponent = ({ onSearchChange }) => {
  const theme = useTheme();
  const API_URL = "/api/snippets";
  
  // State variables
  const [snippets, setSnippets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreSnippets, setHasMoreSnippets] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnySnippetBeingEdited, setIsAnySnippetBeingEdited] = useState(false);
  const [activeEditId, setActiveEditId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '' });
  
  const SNIPPETS_PER_PAGE = 10;

  // Fetch snippets from API
  const fetchSnippets = useCallback(async (resetList = false, searchQuery = '') => {
    if (isLoading || (!hasMoreSnippets && !resetList)) return;
    
    // If resetting, clear current list and reset pagination
    if (resetList) {
      setSnippets([]);
      setCurrentPage(1);
      setHasMoreSnippets(true);
    }
    
    try {
      // Show loader
      setIsLoading(true);
      
      // Build query parameters
      let url = `${API_URL}?page=${resetList ? 1 : currentPage}&limit=${SNIPPETS_PER_PAGE}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      // Update pagination state
      setHasMoreSnippets(data.pagination.hasMore);
      setCurrentPage(prev => resetList ? 2 : prev + 1);
      
      // Update snippets
      setSnippets(prev => resetList ? [...data.snippets] : [...prev, ...data.snippets]);
      
    } catch (error) {
      console.error('Error fetching snippets:', error);
      setToast({
        open: true,
        message: 'Error loading snippets. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, currentPage, hasMoreSnippets, isLoading]);

  // Initialize
  useEffect(() => {
    fetchSnippets(true);
  }, [fetchSnippets]);

  // Handle search changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof onSearchChange === 'string') {
        fetchSnippets(true, onSearchChange);
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [onSearchChange, fetchSnippets]);

  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (isAnySnippetBeingEdited) return;
      
      const SCROLL_THRESHOLD = 200;
      const scrollPosition = window.innerHeight + window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      
      if (scrollPosition >= bodyHeight - SCROLL_THRESHOLD && !isLoading && hasMoreSnippets) {
        fetchSnippets();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchSnippets, hasMoreSnippets, isAnySnippetBeingEdited, isLoading]);

  // Close toast
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // Copy code to clipboard
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setToast({
      open: true,
      message: 'Code copied to clipboard'
    });
  };

  // Toggle edit mode for a specific snippet
  const toggleEditMode = (id) => {
    // If another snippet is already being edited, prevent this one from opening
    if (isAnySnippetBeingEdited && activeEditId !== id) {
      setToast({
        open: true,
        message: 'Please save or cancel your current edits first'
      });
      return;
    }
    
    if (activeEditId === id) {
      // Exiting edit mode
      setIsAnySnippetBeingEdited(false);
      setActiveEditId(null);
    } else {
      // Entering edit mode
      setIsAnySnippetBeingEdited(true);
      setActiveEditId(id);
      
      // Scroll to the snippet being edited
      const snippetElement = document.getElementById(`snippet-${id}`);
      if (snippetElement) {
        snippetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Cancel edit mode
  const cancelEditMode = () => {
    setIsAnySnippetBeingEdited(false);
    setActiveEditId(null);
  };

  // Update snippet
  const updateSnippet = async (id, formData) => {
    const { title, description, code } = formData;

    if (!title || !description || !code) {
      setToast({
        open: true,
        message: "All fields are required"
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, code })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Reset edit mode
      setIsAnySnippetBeingEdited(false);
      setActiveEditId(null);
      
      // Refresh snippets
      fetchSnippets(true);
      setToast({
        open: true,
        message: "Snippet updated successfully"
      });
    } catch (error) {
      console.error('Error updating snippet:', error);
      setToast({
        open: true,
        message: 'Error updating snippet. Please try again.'
      });
    }
  };

  // Delete snippet
  const deleteSnippet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this snippet?")) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      // Refresh snippets to reflect changes
      fetchSnippets(true);
      setToast({
        open: true,
        message: "Snippet deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting snippet:', error);
      setToast({
        open: true,
        message: 'Error deleting snippet. Please try again.'
      });
    }
  };

  // Snippet component
  const SnippetItem = ({ snippet }) => {
    const [formData, setFormData] = useState({
      title: snippet.title,
      description: snippet.description,
      code: snippet.code
    });
    const isEditing = activeEditId === snippet.id;
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <Card 
        id={`snippet-${snippet.id}`}
        elevation={3}
        sx={{
          mb: 3,
          transition: 'all 0.3s ease',
          transform: isEditing ? 'scale(1.01)' : 'scale(1)',
          border: isEditing ? `2px solid ${theme.palette.primary.main}` : 'none'
        }}
      >
        <CardContent>
          {isEditing ? (
            // Edit Mode
            <Box>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={8}
                required
              />
            </Box>
          ) : (
            // View Mode
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" component="h3">
                  {snippet.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  ID: {snippet.id}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {snippet.description}
              </Typography>
              
              <Box 
                sx={{ 
                  position: 'relative', 
                  mb: 2,
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => copyCode(snippet.code)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    }
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
                <SyntaxHighlighter
                  language="javascript"
                  style={theme.palette.mode === 'dark' ? atomOneDark : atomOneLight}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    borderRadius: '4px'
                  }}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </Box>
            </Box>
          )}
        </CardContent>
        
        <Divider />
        
        <CardActions>
          {isEditing ? (
            <>
              <Button 
                startIcon={<SaveIcon />} 
                variant="contained" 
                color="primary"
                onClick={() => updateSnippet(snippet.id, formData)}
              >
                Save Changes
              </Button>
              <Button 
                startIcon={<CancelIcon />} 
                variant="outlined"
                onClick={cancelEditMode}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                startIcon={<EditIcon />} 
                variant="outlined" 
                color="warning"
                onClick={() => toggleEditMode(snippet.id)}
              >
                Edit
              </Button>
              <Button 
                startIcon={<DeleteIcon />} 
                variant="outlined" 
                color="error"
                onClick={() => deleteSnippet(snippet.id)}
              >
                Delete
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      {isAnySnippetBeingEdited && (
        <Alert 
          severity="warning" 
          icon={<InfoIcon />}
          sx={{ mb: 3 }}
        >
          You are currently editing a snippet. Search is temporarily disabled.
        </Alert>
      )}
      
      {snippets.length === 0 && !isLoading ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          {onSearchChange ? 'No snippets match your search.' : 'No snippets found. Add your first code snippet!'}
        </Alert>
      ) : (
        <Box>
          {snippets.map(snippet => (
            <SnippetItem key={snippet.id} snippet={snippet} />
          ))}
        </Box>
      )}
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!hasMoreSnippets && snippets.length > 0 && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 2, fontStyle: 'italic' }}
        >
          You've reached the end of your snippets!
        </Typography>
      )}
      
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        message={toast.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default CodeListComponent;