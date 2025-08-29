import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  InputBase, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  styled,
  alpha,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Search as SearchIcon,
  Code as CodeIcon,
  Add as AddIcon,
  Terminal as TerminalIcon,
  Folder as FolderIcon
} from '@mui/icons-material';

// Styled components
const Search = styled('div')({
  position: 'relative',
  borderRadius: '4px',
  backgroundColor: alpha('#fff', 0.15),
  '&:hover': {
    backgroundColor: alpha('#fff', 0.25),
  },
  marginLeft: 0,
  width: '100%',
  maxWidth: 300,
});

const SearchIconWrapper = styled('div')({
  padding: '0 8px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledInputBase = styled(InputBase)({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: '8px 8px 8px 32px',
    transition: 'width 0.3s',
    width: '100%',
  },
});

const NavButton = styled(Button)(({ active }) => ({
  margin: '0 4px',
  color: '#fff',
  backgroundColor: active ? '#1976d2' : 'transparent',
  '&:hover': {
    backgroundColor: active ? '#1976d2' : alpha('#fff', 0.15),
  },
}));

const Navbar = ({ isEditing, onSearchChange }) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:960px)'); // hardcoded md breakpoint
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const navItems = [
    { path: '/', label: 'Code', icon: <CodeIcon /> },
    { path: '/add', label: 'Add Code', icon: <AddIcon /> },
    { path: '/cli', label: 'CLI', icon: <TerminalIcon /> },
  ];

  const isActivePath = (path) => location.pathname === path;

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.path}
            component={Link}
            to={item.path}
            selected={isActivePath(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={4} sx={{ backgroundColor: '#333' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
          >
            <FolderIcon sx={{ mr: 1 }} />
            cobit
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <NavButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  active={isActivePath(item.path) ? 1 : 0}
                >
                  {item.label}
                </NavButton>
              ))}
            </Box>
          )}

          {location.pathname === '/' && !isEditing && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </Search>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </>
  );
};

export default Navbar;
