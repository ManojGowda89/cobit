import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: 'auto',
        backgroundColor: 'white',
        boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Container>
        <Typography variant="body2" color="text.secondary" align="center">
          Last updated: {currentDate} UTC | Developed by: ManojGowda89 mail@manojgowda.in
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;