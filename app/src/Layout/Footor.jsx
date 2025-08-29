import React, { useContext } from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'light' 
          ? theme.palette.grey[200] 
          : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
        >
          Last updated: {currentDate} | Developed by: {' '}
          <Link 
            color="inherit" 
            href="mailto:mail@manojgowda.in"
            underline="hover"
          >
            ManojGowda89
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;  