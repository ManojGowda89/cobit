import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  Container,
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
  Menu as MenuIcon
} from '@mui/icons-material';

const Navbar = ({ isEditing }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { id: 'code', label: 'Code', icon: <ListIcon />, path: '/' },
    { id: 'add', label: 'Add Code', icon: <AddIcon />, path: '/add' },
    { id: 'cli', label: 'CLI', icon: <TerminalIcon />, path: '/cli' },
    { id: 'auth', label: 'Auth', icon: <TerminalIcon />, path: '/auth' }
  ];

  const renderNavButtons = () => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.id}
            startIcon={item.icon}
            color="inherit"
            sx={{
              mx: 1,
              borderRadius: 0,
              borderBottom: isActive ? '2px solid' : '2px solid transparent',
              borderColor: isActive ? 'success.main' : 'transparent',
              '&:hover': {
                borderBottom: '2px solid',
                borderColor: 'success.light',
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        );
      })}
    </>
  );

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              button 
              key={item.id} 
              onClick={() => navigate(item.path)}
              sx={{
                borderBottom: isActive ? '2px solid' : '2px solid transparent',
                borderColor: isActive ? 'success.main' : 'transparent',
                m: 1,
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
