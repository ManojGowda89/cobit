import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. Import hooks
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  List as ListIcon, 
  Add as AddIcon, 
  Terminal as TerminalIcon,
  Search as SearchIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

// 2. Remove currentView and onViewChange from props
const Navbar = ({ isEditing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 3. Get router location and navigate function
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement debounced search function here
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // 4. Add 'path' property to align with your routes in App.jsx
  const navItems = [
    { id: 'code', label: 'Code', icon: <ListIcon />, path: '/' },
    { id: 'add', label: 'Add Code', icon: <AddIcon />, path: '/add' },
    { id: 'cli', label: 'CLI', icon: <TerminalIcon />, path: '/cli' }
  ];

  const renderNavButtons = () => (
    <>
      {navItems.map((item) => {
        // 5. Check if the current URL pathname matches the item's path
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.id}
            startIcon={item.icon}
            // 6. Use isActive for styling
            color={isActive ? 'success' : 'inherit'}
            sx={{
              mx: 1,
              borderRadius: 1,
              backgroundColor: isActive ? 'success.main' : 'transparent',
              color: isActive ? 'dark.main' : 'inherit',
              '&:hover': {
                backgroundColor: isActive ? 'success.light' : 'rgba(255, 255, 255, 0.08)'
              }
            }}
            // 7. Use navigate function on click
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        );
      })}
    </>
  );

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              button 
              key={item.id} 
              // Use navigate here as well
              onClick={() => navigate(item.path)}
              // Use isActive for selected state
              selected={isActive}
              sx={{
                borderRadius: 1,
                m: 1,
                backgroundColor: isActive ? 'success.light' : 'transparent',
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main', boxShadow: 3, mb: 0 }}>
        <Container>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box component="span" sx={{ mr: 1 }}>📁</Box>
              cobit
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ backgroundColor: 'white', boxShadow: 1, mb: 3 }}>
        <Container>
          <Toolbar>
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
              </>
            ) : (
              <Box sx={{ display: 'flex', flexGrow: 1 }}>
                {renderNavButtons()}
              </Box>
            )}

            {location.pathname === '/' && !isEditing && ( // Show search only on the main page
              <TextField
                size="small"
                placeholder="Search by title or description"
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ ml: 2, width: { xs: '100%', sm: 'auto' } }}
              />
            )}
          </Toolbar>
        </Container>
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;